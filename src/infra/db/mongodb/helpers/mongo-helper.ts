import { MongoClient } from 'mongodb';

export const MongoHelper = {
  client: MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect(): Promise<void> {
    this.client.close();
  }
};
