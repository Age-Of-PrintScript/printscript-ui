import {
  Box,
  Button,
  capitalize,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@mui/material";
import {AddSnippetModal} from "./AddSnippetModal.tsx";
import {useRef, useState} from "react";
import {Add, Search} from "@mui/icons-material";
import {LoadingSnippetRow, SnippetRow} from "./SnippetRow.tsx";
import {
  CreateSnippetWithLang,
  getFileLanguage,
  Snippet,
  SnippetFilters,
  SnippetRelation,
  SnippetSortField
} from "../../utils/snippet.ts";
import {usePaginationContext} from "../../contexts/paginationContext.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {useGetFileTypes, useGetLanguages} from "../../utils/queries.tsx";

type SnippetTableProps = {
  handleClickSnippet: (id: string) => void;
  snippets?: Snippet[];
  loading: boolean;
  handleSearchSnippet: (snippetName: string) => void;
  filters?: SnippetFilters;
  onFilterChange?: (patch: Partial<SnippetFilters>) => void;
  onSortChange?: (field: SnippetSortField) => void;
}

export const SnippetTable = (props: SnippetTableProps) => {
  const {snippets, handleClickSnippet, loading, handleSearchSnippet, filters, onFilterChange, onSortChange} = props;
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [popoverMenuOpened, setPopoverMenuOpened] = useState(false)
  const [snippet, setSnippet] = useState<CreateSnippetWithLang | undefined>()

  const popoverRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {page, page_size: pageSize, count, handleChangePageSize, handleGoToPage} = usePaginationContext()
  const {createSnackbar} = useSnackbarContext()
  const {data: fileTypes} = useGetFileTypes();
  const {data: languageOptions} = useGetLanguages();

  const handleLoadSnippet = async (target: EventTarget & HTMLInputElement) => {
    const files = target.files
    if (!files || !files.length) {
      createSnackbar('error', "Please select at least one file")
      return
    }
    const file = files[0]
    const splitName = file.name.split(".")
    const fileType = getFileLanguage(fileTypes ?? [], splitName.at(-1))
    if (!fileType) {
      createSnackbar('error', `File type ${splitName.at(-1)} not supported`)
      return
    }
    const matchedLang = languageOptions?.find((l) => l.language === fileType.language);
    const defaultVersion = matchedLang?.versions.at(-1) ?? "1.1";
    file.text().then((text) => {
      setSnippet({
        name: splitName[0],
        content: text,
        language: fileType.language,
        version: defaultVersion,
        extension: fileType.extension
      })
      createSnackbar('success', 'File loaded successfully')
    }).catch(e => {
      console.error(e)
      createSnackbar('error', 'Failed to read file')
    }).finally(() => {
      setAddModalOpened(true)
      target.value = ""
    })
  }

  function handleClickMenu() {
    setPopoverMenuOpened(false)
  }

  return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
          <Box sx={{background: 'white', width: '28%', minWidth: 200, display: 'flex'}}>
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Search FileType"
                inputProps={{'aria-label': 'search'}}
                onChange={e => handleSearchSnippet(e.target.value)}
            />
            <IconButton type="button" sx={{p: '10px'}} aria-label="search">
              <Search/>
            </IconButton>
          </Box>
          {onFilterChange && (
            <Box display="flex" flexDirection="row" gap={1.5} alignItems="center" flexWrap="wrap">
              <FormControl size="small" sx={{minWidth: 120, background: 'white'}}>
                <InputLabel id="filter-relation-label">Relation</InputLabel>
                <Select
                  labelId="filter-relation-label"
                  label="Relation"
                  value={filters?.relation ?? 'ALL'}
                  onChange={(e) => onFilterChange({relation: e.target.value as SnippetRelation})}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="OWNED">Mine</MenuItem>
                  <MenuItem value="SHARED">Shared</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{minWidth: 130, background: 'white'}}>
                <InputLabel id="filter-language-label">Language</InputLabel>
                <Select
                  labelId="filter-language-label"
                  label="Language"
                  value={filters?.language ?? ''}
                  onChange={(e) => onFilterChange({language: e.target.value || undefined})}
                >
                  <MenuItem value="">All</MenuItem>
                  {languageOptions?.map((lang) => (
                    <MenuItem key={lang.language} value={lang.language}>
                      {capitalize(lang.language)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{minWidth: 145, background: 'white'}}>
                <InputLabel id="filter-compliance-label">Conformance</InputLabel>
                <Select
                  labelId="filter-compliance-label"
                  label="Conformance"
                  value={filters?.compliance ?? ''}
                  onChange={(e) =>
                    onFilterChange({
                      compliance: (e.target.value || undefined) as SnippetFilters['compliance'],
                    })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="COMPLIANT">Compliant</MenuItem>
                  <MenuItem value="NON_COMPLIANT">Not compliant</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          <Button ref={popoverRef} variant="contained" disableRipple sx={{boxShadow: 0}}
                  onClick={() => setPopoverMenuOpened(true)}>
            <Add/>
            Add Snippet
          </Button>
        </Box>
        <Table size="medium" sx={{borderSpacing: "0 10px", borderCollapse: "separate"}}>
          <TableHead>
            <TableRow sx={{fontWeight: 'bold'}}>
              <StyledTableCell sx={{fontWeight: "bold"}}>
                {onSortChange ? (
                  <TableSortLabel
                    active={filters?.sortBy === 'NAME'}
                    direction={filters?.sortBy === 'NAME' ? (filters?.sortDir === 'DESC' ? 'desc' : 'asc') : 'asc'}
                    onClick={() => onSortChange('NAME')}
                  >
                    Name
                  </TableSortLabel>
                ) : 'Name'}
              </StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>
                {onSortChange ? (
                  <TableSortLabel
                    active={filters?.sortBy === 'LANGUAGE'}
                    direction={filters?.sortBy === 'LANGUAGE' ? (filters?.sortDir === 'DESC' ? 'desc' : 'asc') : 'asc'}
                    onClick={() => onSortChange('LANGUAGE')}
                  >
                    Language
                  </TableSortLabel>
                ) : 'Language'}
              </StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Author</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>
                {onSortChange ? (
                  <TableSortLabel
                    active={filters?.sortBy === 'COMPLIANCE'}
                    direction={filters?.sortBy === 'COMPLIANCE' ? (filters?.sortDir === 'DESC' ? 'desc' : 'asc') : 'asc'}
                    onClick={() => onSortChange('COMPLIANCE')}
                  >
                    Conformance
                  </TableSortLabel>
                ) : 'Conformance'}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{
            loading ? (
                <>
                  {Array.from({length: 10}).map((_, index) => (
                      <LoadingSnippetRow key={index}/>
                  ))}
                </>
            ) : (
                <>
                  {
                      snippets && snippets.map((snippet) => (
                          <SnippetRow data-testid={"snippet-row"}
                                      onClick={() => handleClickSnippet(snippet.id)} key={snippet.id} snippet={snippet}/>
                      ))
                  }
                </>
            )
          }
          </TableBody>
          <TablePagination count={count} page={page} rowsPerPage={pageSize}
                           onPageChange={(_, page) => handleGoToPage(page)}
                           onRowsPerPageChange={e => handleChangePageSize(Number(e.target.value))}/>
        </Table>
        <AddSnippetModal defaultSnippet={snippet} open={addModalOpened}
                         onClose={() => setAddModalOpened(false)}/>
        <Menu anchorEl={popoverRef.current} open={popoverMenuOpened} onClick={handleClickMenu}>
          <MenuItem onClick={() => setAddModalOpened(true)}>Create snippet</MenuItem>
          <MenuItem onClick={() => inputRef?.current?.click()}>Load snippet from file</MenuItem>
        </Menu>
        <input hidden type={"file"} ref={inputRef} multiple={false} data-testid={"upload-file-input"}
               onChange={e => handleLoadSnippet(e?.target)}/>
      </>
  )
}


export const StyledTableCell = styled(TableCell)`
    border: 0;
    align-items: center;
`
