import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Drawer} from "@mui/material";
import {useGetSnippets} from "../utils/queries.tsx";
import {usePaginationContext} from "../contexts/paginationContext.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import {SnippetFilters, SnippetSortField} from "../utils/snippet.ts";

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [snippetName, setSnippetName] = useState('');
  const [filters, setFilters] = useState<SnippetFilters>({relation: 'ALL'});
  const [snippetId, setSnippetId] = useState<string | null>(null)
  const {page, page_size, count, handleChangeCount, handleGoToPage} = usePaginationContext()
  const {data, isLoading} = useGetSnippets(page, page_size, {...filters, name: snippetName})

  useEffect(() => {
    if (data?.count !== undefined && data.count !== count) {
      handleChangeCount(data.count)
    }
  }, [count, data?.count, handleChangeCount]);


  useEffect(() => {
    if (paramsId) {
      setSnippetId(paramsId);
    }
  }, [paramsId]);

  const handleCloseModal = () => setSnippetId(null)

  // DeBounce Function
  useDebounce(() => {
        if (searchTerm !== snippetName) {
          handleGoToPage(0)
          setSnippetName(searchTerm)
        }
      }, [searchTerm, snippetName, handleGoToPage], 800
  );

  const handleSearchSnippet = (snippetName: string) => {
    setSearchTerm(snippetName);
  };

  const handleFilterChange = (patch: Partial<SnippetFilters>) => {
    handleGoToPage(0);
    setFilters((prev) => ({...prev, ...patch}));
  };

  const handleSortChange = (field: SnippetSortField) => {
    handleGoToPage(0);
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
      <>
        <SnippetTable loading={isLoading} handleClickSnippet={setSnippetId} snippets={data?.snippets}
                      handleSearchSnippet={handleSearchSnippet} filters={filters}
                      onFilterChange={handleFilterChange} onSortChange={handleSortChange}/>
        <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
          {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId}/>}
        </Drawer>
      </>
  )
}

export default withNavbar(HomeScreen);

