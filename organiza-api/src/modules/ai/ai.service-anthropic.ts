import { AiPromptSchema } from "./ai.schema";
import { prisma } from "../../lib/prisma";
import { iaClient } from "../../lib/anthropic";
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

    const systemPrompt = `Você é um assistente de produtividade integrado a um app de tarefas.
    
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

    const message = await iaClient.messages.create({
      max_tokens: 1024,
      messages: [{ content: prompt.prompt, role: "user" }],
      model: "claude-sonnet-4-20250514",
      system: systemPrompt,
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : null;

    if (!responseText) {
      throw new AppError("A IA não retornou uma resposta válida", 500);
    }

    const responseJson = JSON.parse(responseText);

    if (responseJson.action === "create_list") {
      const createdList: List = await ListsService.createList(
        userId,
        responseJson.list.title,
        responseJson.list.color,
      );
      const dataTasks = responseJson.tasks.map((task: IaTask) => {
        return {
          ...task,
          listId: createdList.id,
        };
      });
      const tasksCreated = await TaskService.createManyTasks(dataTasks);

      return tasksCreated;
    } else {
      const dataTasks = responseJson.tasks.map((task: IaTask) => {
        return {
          ...task,
          listId: responseJson.listId,
        };
      });
      const tasksCreated = await TaskService.createManyTasks(dataTasks);

      return tasksCreated;
    }
  }
}

export { AiService };
