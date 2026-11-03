import { Card, Table } from 'antd';
import type { TableProps } from 'antd';

import { PAGE_SIZE_OPTIONS } from '../hooks/use-data-list';

interface DataListCardProps<T> extends Omit<TableProps<T>, 'pagination' | 'dataSource' | 'title'> {
    title: React.ReactNode;
    extra?: React.ReactNode;
    data: T[];
    total: number;
    loading: boolean;
    pageIndex: number;
    pageSize: number;
    onPageChange: (page: number, size: number) => void;
}

/** Card wrapping a server side paginated table. */
export function DataListCard<T extends object>({
    title,
    extra,
    data,
    total,
    loading,
    pageIndex,
    pageSize,
    onPageChange,
    ...tableProps
}: DataListCardProps<T>) {
    return (
        <Card className="ant-card-data-list" title={title} extra={extra}>
            <Table<T>
                size="small"
                rowKey="id"
                dataSource={data}
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: pageIndex,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                    showTotal: (count, range) =>
                        `当前显示 ${count} 条记录中的第 ${range[0]} 至 ${range[1]} 条`,
                    onChange: onPageChange,
                }}
                {...tableProps}
            />
        </Card>
    );
}
