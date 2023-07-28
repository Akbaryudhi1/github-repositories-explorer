import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingAnimation from "./items/loadingAnimation";
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [openrepo, setOpenrepo] = useState(null);
  const [openIdxRepo, setIdxRepo] = useState(0);
  const [openRepoName, setReponame] = useState(0);
  const getData = async () => {
    setLoading(true);
    await axios
      .get(`https://api.github.com/search/users?q=${text}&per_page=5`)
      .then((res) => {
        setData(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setText("");
        setLoading(false);
      });
  };
  const getRepo = async () => {
    setLoading(true);
    await axios
      .get(`https://api.github.com/users/${openRepoName}/repos`)
      .then((res) => {
        setData(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setText("");
        setLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const onClickItem = (item, idx) => {
    setReponame(item.login);
    getRepo();
    if (openIdxRepo === idx) {
      setOpenrepo(null);
      setIdxRepo(0);
    } else {
      setOpenrepo(item);
      setIdxRepo(idx);
    }
  };

  return (
    <>
      <div className="container">
        <div className="inputButton">
          <input type="text" value={text} onChange={(event) => setText(event.target.value)} className="inputSearch" placeholder="username" />
          <button onClick={() => getData()} className="buttonSearch">
            Search
          </button>
        </div>
        {data?.length >= 1 &&
          data.map((item, index) => {
            return (
              <div key={item.id} onClick={() => onClickItem(item, index)} className="box-border h-8 w-320 p-4 border-4">
                <h1>{item.login}</h1>

                {openIdxRepo === index && openrepo && (
                  <div>
                    <p>Item Details:</p>
                    <a href={item.html_url} target="_blank">
                      Repository
                    </a>
                    <p>ID: {openrepo.id}</p>
                    <p>Name: {openrepo.name}</p>
                    <p>Location: {openrepo.location}</p>
                  </div>
                )}
              </div>
            );
          })}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "6rem",
            }}
          >
            <LoadingAnimation />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
