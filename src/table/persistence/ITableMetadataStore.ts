import * as Models from "../generated/artifacts/models";
import Context from "../generated/Context";

// Since the host name may change, we don't store host in {@code odatametadata, odatatid}
export interface IOdataAnnotations {
  odatametadata: string;
  odatatype: string;
  odataid: string;
  odataeditLink: string;
}

export interface IOdataAnnotationsOptional {
  odatametadata?: string;
  odatatype?: string;
  odataid?: string;
  odataeditLink?: string;
}

interface ITable {
  tableAcl?: Models.SignedIdentifier[];
  account: string;
  table: string;
}

export type Table = ITable & IOdataAnnotationsOptional;

export interface IEntity {
  PartitionKey: string;
  RowKey: string;
  eTag: string;
  lastModifiedTime: Date;
  properties: {
    [propertyName: string]: string | number | boolean | null;
  };
}

export type Entity = IEntity & IOdataAnnotationsOptional;

export default interface ITableMetadataStore {
  createTable(context: Context, tableModel: Table): Promise<void>;
  queryTable(
    context: Context,
    account: string,
    queryOptions: Models.QueryOptions,
    nextTable?: string
  ): Promise<[Table[], string | undefined]>;
  deleteTable(context: Context, table: string, account: string): Promise<void>;
  queryTableEntities(
    context: Context,
    account: string,
    table: string,
    queryOptions: Models.QueryOptions,
    nextPartitionKey?: string,
    nextRowKey?: string
  ): Promise<[Entity[], string | undefined, string | undefined]>;
  queryTableEntitiesWithPartitionAndRowKey(
    context: Context,
    table: string,
    account: string,
    partitionKey: string,
    rowKey: string
  ): Promise<Entity | undefined>;
  insertOrUpdateTableEntity(
    context: Context,
    table: string,
    account: string,
    entity: Entity,
    ifMatch?: string
  ): Promise<Entity>;
  insertOrMergeTableEntity(
    context: Context,
    table: string,
    account: string,
    entity: Entity,
    ifMatch?: string
  ): Promise<Entity>;
  deleteTableEntity(
    context: Context,
    table: string,
    account: string,
    partitionKey: string,
    rowKey: string,
    etag: string
  ): Promise<void>;
  insertTableEntity(
    context: Context,
    table: string,
    account: string,
    entity: Entity
  ): Promise<Entity>;
  getTableAccessPolicy(
    context: Context,
    table: string,
    options: Models.TableGetAccessPolicyOptionalParams
  ): Promise<Models.TableGetAccessPolicyResponse>;
  setTableAccessPolicy(
    context: Context,
    table: string,
    options: Models.TableSetAccessPolicyOptionalParams
  ): Promise<Models.TableSetAccessPolicyResponse>;
  init(): void;
  close(): void;
}
