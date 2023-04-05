import '../../style/pageStyles/HomePage.css'
import { useState } from 'react';
import TileContainer from '../TileContainer'

// export Page component
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  async function handleSearchQuery() {
    // setMsg("");
      setSearchResult([]);
      let fetchImages = async (type) => {
          const response = await fetch(`/search?name=${searchTerm.replaceAll(" ","-")}&type=${type}`);
          const json = await response.json();
          if( response.ok ) { setSearchResult( pre => {
            if( json.length === 0 ) { return pre; }
            return [...pre,
              {
                type: type,
                list: json
              }
            ]
          } ); }
      }
      let keys = [
        "anime", "manga", "movie", "tv-series", "book", "audio-book", "webtoon", "documentary", "songs"
      ]
      for( let key of keys ) {
        await fetchImages(key);
      }
      setMsg("No results found");
      setTimeout( () => { setMsg(""); }, 2000 );
      
  }

  localStorage.setItem("selected",0);
    return (
      <>
        <div className='homepage'>
            <div className='search-result-container'>
              {searchResult.length === 0 && searchTerm === "" && <div className='message'>
                😑 Navigate the tabs mate.<br/>
                Or search if you wish to.
              </div>}
              { (searchTerm !== "" || searchResult.length > 0) && <h1 className='search-message'>Search for "{searchTerm}"</h1>}
              {searchResult.length >= 0 &&
                <>
                  {searchResult.length === 0 && <h2 className='no-result'>{msg}</h2>}
                  {searchResult.map(function(item) {
                    return (
                      <>
                      <h2 className='search-type'>{item.type.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</h2>
                      <div className='main-container search-result'>
                          <TileContainer info={item.list} toDisplay={-1} areSearchResults={true} type={item.type} />
                      </div>
                      </>
                  )
                })}
              </>
            }
            </div>
            <div className='searchBar'>
              <input
                className='searchInput'
                type="text"
                placeholder='Search...'
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchQuery();
                  }
                }}
              />
              <button onClick={handleSearchQuery} className='searchButton'>🔍 Search</button>
            </div>
        </div>
      </>
    );
  }