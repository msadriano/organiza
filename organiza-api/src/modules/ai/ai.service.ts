import { AiPromptSchema } from "./ai.schema";
import { prisma } from "../../lib/prisma";
import { geminiClient } from "../../lib/gemini";
import { AppError } from "../../utils/app.error";
import { ListsService } from "../lists/lists.service";
import { List } from "../../types/lists.type";
import { IaTask } from "../../types/task.type";
import { TaskService } from "../tasks/tasks.service";

class AiService {
  static async createTasks(userId: string, prompt: AiPromptSchema) {
    const listsByUser = await prisma.list.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const today = new Date().toISOString();

    const systemPrompt = `Você é um assistente de produtividade integrado a um app de tarefas.

    A data e hora atual é: ${today}
    
    Seu trabalho é interpretar solicitações em linguagem natural e retornar APENAS um objeto JSON válido, sem texto adicional, sem markdown, sem explicações.

    O usuário possui as seguintes listas cadastradas:${JSON.stringify(listsByUser.map((list) => ({ id: list.id, title: list.title })))}

    Você deve retornar APENAS um dos seguintes formatos:

    1. Para criar uma lista com tarefas:
    {
        "action": "create_list",
        "list": {
            "title": "Nome da lista",
            "color": "#hexcolor"
        },
        "tasks": [
            {
            "title": "Título da tarefa", "description": "Descrição da tarefa", "priority": "HIGH" | "MEDIUM" | "LOW", "dueDate": "ISO 8601 ou null" }
        ]
    }

    2. Para criar tarefas em uma lista existente:
    {
        "action": "create_tasks",
        "listId": "id da lista existente",
        "tasks": [
            { "title": "Título da tarefa", "description": "Descrição da tarefa", "priority": "HIGH" | "MEDIUM" | "LOW", "dueDate": "ISO 8601 ou null" }
        ]
    }

    Regras:
    - Se o usuário mencionar uma lista que já existe, use o id dela e a action "create_tasks"
    - Se a lista não existir, use "create_list" e crie junto com as tarefas
    - Priority deve ser inferida pelo contexto — tarefas urgentes são HIGH, normais MEDIUM, sem urgência LOW
    - dueDate deve ser null se não for mencionado
    - Responda APENAS com o JSON, sem nenhum texto adicional`;

    const model = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(
      prompt.prompt + "\n\n" + systemPrompt,
    );

    const responseText = result.response.text();

    if (!responseText) {
      throw new AppError("A IA não retornou uma resposta válida", 500);
    }

    const cleanedResponse = responseText
      .replace(/```json\n?|\n?```/g, "")
      .trim();

    let responseJson;

    try {
      responseJson = JSON.parse(cleanedResponse);
    } catch (error) {
      throw new AppError("a IA retornou uma resposta inesperada", 502);
    }

    if (responseJson.action === "create_list") {
      const createdList: List = await ListsService.createList(
        userId,
        responseJson.list.title,
        responseJson.list.color,
      );
      const dataTasks = responseJson.tasks.map((task: IaTask) => {
        return {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          listId: createdList.id,
        };
      });

      const tasksCreated = await TaskService.createManyTasks(dataTasks);
      return tasksCreated;
    } else {
      const listBelongsToUser = listsByUser.some(
        (list) => list.id === responseJson.listId,
      );

      if (!listBelongsToUser) {
        throw new AppError("Lista não encontrada", 404);
      }

      const dataTasks = responseJson.tasks.map((task: IaTask) => {
        return {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          listId: responseJson.listId,
        };
      });

      const tasksCreated = await TaskService.createManyTasks(dataTasks);

      return tasksCreated;
    }
  }
}

export { AiService };
