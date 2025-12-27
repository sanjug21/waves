import { pipeline, env } from '@xenova/transformers';

// Important for Vercel/Serverless
env.allowLocalModels = false;
env.cacheDir = '/tmp/transformers-cache';

export class Recommender {
  static async getEmbedding(text: string) {
    try {
      // Use a small, efficient model to avoid memory crashes
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (error) {
      console.error("Embedding error:", error);
      throw error;
    }
  }
}
// import { pipeline } from '@xenova/transformers';

// // Singleton extractor to avoid reloading model per request
// let extractor: any = null;

// export class Recommender {
//   static async getExtractor() {
//     if (!extractor) {
//       extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//     }
//     return extractor;
//   }

//   static async getEmbedding(text: string): Promise<Float32Array> {
//     const extractor = await this.getExtractor();
//     const output = await extractor(text, { pooling: 'mean', normalize: true });
//     return output.data;
//   }

//   static cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
//     let dotProduct = 0.0;
//     let normA = 0.0;
//     let normB = 0.0;

//     for (let i = 0; i < vecA.length; i++) {
//       dotProduct += vecA[i] * vecB[i];
//       normA += vecA[i] * vecA[i];
//       normB += vecB[i] * vecB[i];
//     }

//     if (normA === 0 || normB === 0) return 0;
//     return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
//   }
// }


// // import { pipeline } from '@xenova/transformers';

// // // We use a singleton pattern so we don't reload the heavy model on every API call
// // let extractor: any = null;

// // export class Recommender {
// //   static async getExtractor() {
// //     if (!extractor) {
// //       // Downloads the model locally on first run
// //       extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
// //     }
// //     return extractor;
// //   }

// //   /**
// //    * Converts text into a vector (array of numbers)
// //    */
// //   static async getEmbedding(text: string): Promise<Float32Array> {
// //     const extractor = await this.getExtractor();
// //     // 'mean' pooling gives us a single vector for the whole sentence
// //     const output = await extractor(text, { pooling: 'mean', normalize: true });
// //     return output.data;
// //   }

// //   /**
// //    * Calculates how similar two vectors are (Cosine Similarity)
// //    * Returns a value between -1 and 1 (1 means identical)
// //    */
// //   static cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
// //     let dotProduct = 0.0;
// //     let normA = 0.0;
// //     let normB = 0.0;

// //     for (let i = 0; i < vecA.length; i++) {
// //       dotProduct += vecA[i] * vecB[i];
// //       normA += vecA[i] * vecA[i];
// //       normB += vecB[i] * vecB[i];
// //     }

// //     if (normA === 0 || normB === 0) return 0;
// //     return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
// //   }
// // }