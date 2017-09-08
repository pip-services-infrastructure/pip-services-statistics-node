let _ = require('lodash');

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services-data-node';

import { StatCounterTypeV1 } from '../data/version1/StatCounterTypeV1';
import { StatCounterV1 } from '../data/version1/StatCounterV1';
import { StatCounterRecordV1 } from '../data/version1/StatCounterRecordV1';
import { IStatisticsPersistence } from './IStatisticsPersistence';
import { StatCounterKeyGenerator } from './StatCounterKeyGenerator';

export class StatisticsMemoryPersistence extends IdentifiableMemoryPersistence<StatCounterRecordV1, string>
    implements IStatisticsPersistence {

    constructor() {
        super();
        this._maxPageSize = 1000;
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        let items = _.map(this._items, (item) => item.group);
        items = _.uniq(items);

        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total)
            total = items.length;
        
        if (skip > 0)
            items = _.slice(items, skip);
        items = _.take(items, take);
                
        let page = new DataPage<string>(items, total);
        callback(null, page);
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: StatCounterRecordV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.group, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        let search = filter.getAsNullableString('search');
        let group = filter.getAsNullableString('group');
        let name = filter.getAsNullableString('name');
        let type = filter.getAsNullableInteger('type');
        let timezone = filter.getAsNullableString('timezone');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let fromId = fromTime != null ? StatCounterKeyGenerator.makeCounterKey(group, name, type, fromTime, timezone) : null;
        let toTime = filter.getAsNullableDateTime('to_time');
        let toId = toTime != null ? StatCounterKeyGenerator.makeCounterKey(group, name, type, toTime, timezone) : null;

        return (item: StatCounterRecordV1) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (type != null && type != item.type)
                return false;
            if (group != null && item.group != group)
                return false;
            if (name != null && item.name != name)
                return false;
            if (fromId != null && item.id < fromId)
                return false;
            if (toId != null && item.id > toId)
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<StatCounterRecordV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getListByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any, list: StatCounterRecordV1[]) => void): void {
        super.getListByFilter(correlationId, this.composeFilter(filter), null, null, callback);
    }

    private incrementOne(correlationId: string, group: string, name: string, type: StatCounterTypeV1,
        time: Date, timezone: string, value: number,
        callback?: (err: any, item: StatCounterRecordV1) => void): void {
        
        let id = StatCounterKeyGenerator.makeCounterKey(group, name, type, time, timezone);

        let item = this._items.find((x) => { return x.id == id; });
        if (item != null) {
            item.value += value;
        } else {
            item = new StatCounterRecordV1(group, name, type, time, timezone, value);
            item.id = id;
            this._items.push(item);
        }

        if (callback) callback(null, item);
    }

    public increment(correlationId: string, group: string, name: string,
        time: Date, timezone: string, value: number,
        callback?: (err: any, added: boolean) => void): void {
        
            let added = false;
        this.incrementOne(correlationId, group, name, StatCounterTypeV1.Total, time, timezone, value, (err, data) => {
            added = data.value == value;
        });
        this.incrementOne(correlationId, group, name, StatCounterTypeV1.Year, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1.Month, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1.Day, time, timezone, value);
        this.incrementOne(correlationId, group, name, StatCounterTypeV1.Hour, time, timezone, value);

        this._logger.trace(correlationId, "Incremented %s.%s", group, name);

        this.save(correlationId, (err) => {
            if (callback) callback(err, added);
        });    
    }

}
