import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Server } from 'http';

@Injectable()
export class ShutdownObserver implements OnApplicationShutdown {
  private httpServers: Server[] = [];

  public addHttpServer(server: Server): void {
    this.httpServers.push(server);
  }

  public async onApplicationShutdown(): Promise<void> {
    await Promise.all(
      this.httpServers.map(
        (server) =>
          new Promise((resolve, reject) => {
            server.close((error) => {
              if (error) {
                reject(error);
              } else {
                resolve(null);
              }
            });
          }),
      ),
    );
  }
}
