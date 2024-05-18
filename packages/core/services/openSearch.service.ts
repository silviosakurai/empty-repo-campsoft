import { Client } from "@opensearch-project/opensearch";
import { injectable } from "tsyringe";
import { openSearchEnvironment } from "@core/config/environments";
import { LogLevel } from "@core/common/enums/LogLevel";
import { CreateCartRequest } from "@core/useCases/cart/dtos/CreateCartRequest.dto";
import { PlanPrice } from "@core/common/enums/models/plan";
import { ISignatureActiveByClient } from "@core/interfaces/repositories/signature";
import { CartDocument } from "@core/interfaces/repositories/cart";

interface SearchResponse<T> {
  statusCode: number;
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: T;
    }>;
  };
}

@injectable()
class OpenSearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: openSearchEnvironment.openSearchHost,
      auth: {
        username: openSearchEnvironment.openSearchUser,
        password: openSearchEnvironment.openSearchPassword,
      },
    });
  }

  public createDynamicLogStream() {
    return {
      write: (message: string) => {
        try {
          const logObject = JSON.parse(message);

          const index = this.determineIndex(logObject.level);

          this.sendLog(index, logObject).catch(console.error);
        } catch (error) {
          console.error(`Error processing log message: ${error}`);
        }
      },
    };
  }

  private determineIndex(level: number): LogLevel {
    if (level === 60) {
      return LogLevel.FATAL;
    }

    if (level === 50) {
      return LogLevel.ERROR;
    }

    if (level === 40) {
      return LogLevel.WARN;
    }

    if (level === 30) {
      return LogLevel.INFO;
    }

    if (level === 20) {
      return LogLevel.DEBUG;
    }

    if (level === 10) {
      return LogLevel.TRACE;
    }

    return LogLevel.OTHER;
  }

  public async sendLog(index: string, message: any) {
    try {
      await this.client.index({
        index,
        body: message,
      });
    } catch (error: any) {
      console.error(`Error sending log to OpenSearch: ${error.message}`);

      if (error.message.includes("illegal_argument_exception")) {
        try {
          await this.client.index({
            index: "logs-errors",
            body: {
              originalIndex: index,
              errorMessage: error.message,
              log: message,
            },
          });
        } catch (fallbackError) {
          console.error(
            `Error sending log to fallback index: ${fallbackError}`
          );
        }
      }
    }
  }

  async indexCart(
    cartId: string,
    payload: CreateCartRequest,
    totalPrices: PlanPrice,
    productsIdByOrder: string[],
    signatureActiveByClientId: ISignatureActiveByClient[]
  ) {
    const body = {
      cart_id: cartId,
      payload,
      total_prices: totalPrices,
      products_id: productsIdByOrder,
      signature_active: signatureActiveByClientId,
    } as CartDocument;

    await this.client.index({
      index: `cart`,
      body,
    });

    return body;
  }

  async getCart(cartId: string): Promise<CartDocument | null> {
    const response = await this.client.search<SearchResponse<CartDocument>>({
      index: "cart",
      body: {
        query: {
          match: {
            cart_id: cartId,
          },
        },
      },
    });

    if (response.statusCode === 200 && response.body.hits.total.value > 0) {
      return response.body.hits.hits[0]._source;
    } else {
      return null;
    }
  }
}

export default OpenSearchService;
