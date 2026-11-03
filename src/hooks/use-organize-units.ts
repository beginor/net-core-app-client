import { useCallback, useEffect, useState } from 'react';

import { organizeUnitsApi, toTree } from '../api/organize-units';
import type { OrganizeUnitModel } from '../api/organize-units';

export interface OrganizeUnitNode {
    key: string;
    value: string;
    title: string;
    disabled?: boolean;
    children?: OrganizeUnitNode[];
}

function toNodes(
    units: OrganizeUnitModel[],
    disabledId?: string,
    parentDisabled = false,
): OrganizeUnitNode[] {
    return units.map((unit) => {
        const disabled = parentDisabled || unit.id === disabledId;
        const node: OrganizeUnitNode = {
            key: unit.id,
            value: unit.id,
            title: unit.name,
            disabled,
        };
        if (unit.children && unit.children.length > 0) {
            node.children = toNodes(unit.children, disabledId, disabled);
        }
        return node;
    });
}

/** Load the organize unit tree of the current account. */
export function useOrganizeUnits(disabledId?: string) {
    const [units, setUnits] = useState<OrganizeUnitModel[]>([]);
    const [loading, setLoading] = useState(false);

    const reload = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const result = await organizeUnitsApi.search({ skip: 0, take: 9999 });
            setUnits(toTree(result.data ?? []));
        }
        catch (ex) {
            console.error(ex);
            setUnits([]);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            await reload();
        })();
    }, [reload]);

    return { units, treeData: toNodes(units, disabledId), loading, reload };
}
