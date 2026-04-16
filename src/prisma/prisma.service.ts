import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy  {
    private readonly logger = new Logger(PrismaService.name)

    public constructor() {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 300000,
        connectionTimeoutMillis: 5000,
        
      })

      super({ adapter })
    }

    public async onModuleInit() {
      const start = Date.now()

      this.logger.log('Connection to database...')

      try {
        await this.$connect();

        const ms = Date.now() - start

        this.logger.log(`Database connection established (time=${ms}ms)`)
      } catch (error) {
        this.logger.error('Failed to connect to database: ', error)

        throw error
      }
    }

    public async onModuleDestroy() {
      this.logger.log('Disconnecting form database...')

      try {
        await this.$disconnect();

        this.logger.log(`Database connection closed`)
      } catch (error) {
        this.logger.error('Failed to disconnect frmo database: ', error)

        throw error
      }
    }
  }
