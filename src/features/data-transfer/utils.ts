import { ColumnMapping } from './types';

export const inferMappings = (sourceColumns: string[], targetFields: string[]): ColumnMapping[] => {
  return sourceColumns
    .map((source) => {
      const normalizedSource = source.trim().toLowerCase();
      const target = targetFields.find((field) => normalizedSource === field.toLowerCase() || normalizedSource === field.replace(/_/g, ' '));
      if (!target) return undefined;
      return { sourceColumn: source, targetField: target };
    })
    .filter((mapping): mapping is ColumnMapping => Boolean(mapping));
};

export const mergeMappings = (existing: ColumnMapping[], updates: ColumnMapping[]): ColumnMapping[] => {
  const map = new Map(existing.map((item) => [item.targetField, item] as const));
  updates.forEach((mapping) => {
    map.set(mapping.targetField, mapping);
  });
  return Array.from(map.values());
};

export const isMappingComplete = (mappings: ColumnMapping[], requiredFields: string[]): boolean => {
  const mapped = new Set(mappings.map((mapping) => mapping.targetField));
  return requiredFields.every((field) => mapped.has(field));
};
