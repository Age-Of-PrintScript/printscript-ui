import {Pagination} from "./pagination.ts";
import {FileType} from "../types/FileType.ts";

export type ComplianceEnum =
    'pending' |
    'failed' |
    'not-compliant' |
    'compliant'

// OWNER no es asignable via compartir: lo rechaza permissions-service.
export type ShareRole = 'EDITOR' | 'VIEWER'


export type CreateSnippet = {
  name: string;
  description?: string;
  content: string;
  language: string;
  version: string;
  extension: string;
}

export type CreateSnippetWithLang = CreateSnippet & { language: string }

export type UpdateSnippet = {
  content: string
}

export type Snippet = CreateSnippet & {
  id: string
} & SnippetStatus

export type LintWarning = {
  message: string;
  line: number;
  column: number;
}

export type SnippetRelation = 'ALL' | 'OWNED' | 'SHARED';
export type SnippetSortField = 'NAME' | 'LANGUAGE' | 'COMPLIANCE';
export type SortDirection = 'ASC' | 'DESC';

export type SnippetFilters = {
  name?: string;
  relation?: SnippetRelation;
  language?: string;
  compliance?: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'FAILED';
  sortBy?: SnippetSortField;
  sortDir?: SortDirection;
}

type SnippetStatus = {
  compliance: ComplianceEnum;
  author: string;
  lintWarnings?: LintWarning[];
}
export type PaginatedSnippets = Pagination & {
  snippets: Snippet[]
}

export const getFileLanguage = (fileTypes: FileType[], fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.extension == fileExt)
}