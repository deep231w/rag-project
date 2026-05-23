import OpenAI from "openai";
import { EmbeddedProvider }
  from "../EmbeddedProvider";

interface ModelConfig {
  apiKey: string;
  model: string;
}

export class OpenAIEmbeddingProvider implements EmbeddedProvider {

  private client: OpenAI;
  private model: string;

  constructor(config: ModelConfig) {

    this.client = new OpenAI({
      apiKey: config.apiKey,
    });

    this.model = config.model;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const res = await this.client.embeddings.create({
          model: this.model,
          input: text,
        });

      const embedding = res.data?.[0]?.embedding;

      if (!embedding) {
        throw new Error("No embedding returned");
      }

      return embedding;

    } catch (e) {
      console.log("error during openai embedding:",e);
      throw new Error("Error during openai embedding");
    }
  }

  async generateEmbeddings(chunks: string[]): Promise<number[][]> {

    return Promise.all(
      chunks.map((chunk) =>
        this.generateEmbedding(chunk)
      )
    );
  }
}