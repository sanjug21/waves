
import { pipeline } from '@xenova/transformers';

// Singleton extractor to avoid reloading model per request
let extractor: any = null;

export class Recommender {
  static async getExtractor() {
    if (!extractor) {
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
  }

  static async getEmbedding(text: string): Promise<Float32Array> {
    const extractor = await this.getExtractor();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return output.data;
  }

  static cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

