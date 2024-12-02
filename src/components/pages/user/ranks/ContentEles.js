import "./leaderBoardAll.css";

const ContentEle = ({
  players,
  filters,
  tableCellRef,
  someRef,
  setFirstVideo,
  MoveStuffAround,
}) => {
  <div className="slide" key={0} style={{ background: "red" }}>
    <div
      className="scores"
      id="score"
      style={{
        height: "100%",
      }}
    >
      <div
        className="table-no-highlight"
        id="nonspacetable"
        // style={{ backgroundColor: "red" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1FB8CF",
            textAlign: "center",
            alignItems: "center",
            display: "flex",
            fontFamily: "Intro",
            justifyContent: "center",
            fontWeight: "bolder",
            fontSize: "1.8em",
          }}
        >
          TODAY'S
        </div>
        <div className="tableTop marginedEle">
          <div className="tabEle tabEle1 tabEleHeaD">Rank</div>
          <div
            className="tabEle tabEle2 tabEleHeaD nameHead"
            style={{ paddingLeft: "1.5vh" }}
          >
            Name
          </div>
          <div className="tabEle tabEle3 tabEleHeaD">Score</div>
        </div>

        <div className="tableBody marginedEle" id="tbScrool">
          {players.map((row, i) => {
            return (
              <div
                ref={
                  row._id === filters.activePlayerEventId
                    ? tableCellRef
                    : someRef
                }
                key={i}
                className={
                  i == 0
                    ? " tbleBody"
                    : i == 1
                    ? " tbleBody"
                    : i == 2
                    ? " tbleBody"
                    : "tbleBody commonEle"
                }
              >
                <div
                  className={
                    i == 0
                      ? "firstLb ulteriorParent upTop"
                      : i == 1
                      ? "secondLb ulteriorParent upTop"
                      : i == 2
                      ? "thirdLb ulteriorParent upTop"
                      : "ulteriorParent upBot "
                  }
                  style={
                    row._id === filters.activePlayerEventId
                      ? {
                          backgroundColor: "#f9ad49",
                          borderColor: "#f9ad49",
                        }
                      : null
                  }
                >
                  <div
                    align="center"
                    size="small"
                    // style={{ fontSize: "2.4em" }}
                    sx={{ color: "inherit", backgroundColor: "red" }}
                    className="tabEle tabEle1 tabEleBdy"
                  >
                    <div
                      style={{
                        width: "2.0vh",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div
                    align="center"
                    size="small"
                    sx={{ color: "inherit" }}
                    className="tabEle tabEle2 tabEleBdy"
                  >
                    {" "}
                    <div className="userName">
                      <img src={row.avatar} /> {row.name}
                    </div>
                  </div>
                  <div
                    align="center"
                    size="small"
                    sx={{ color: "inherit" }}
                    className="tabEle tabEle3 tabEleBdy"
                  >
                    {row.score}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="higlightsection"></div>
      <div
        className="bottomaddScroll"
        style={{ backgroundColor: "white" }}
        onClick={() => {
          // setVidScreen(true);
          setFirstVideo(true);
          // handlePlayVideo();
        }}
      >
        <MoveStuffAround />
      </div>
    </div>
  </div>;
};
export default ContentEle;
<div className="slide" key={0} style={{ background: "red" }}>
    <div
      className="scores"
      id="score"
      style={{
        height: "100%",
      }}
    >
      <div
        className="table-no-highlight"
        id="nonspacetable"
        // style={{ backgroundColor: "red" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1FB8CF",
            textAlign: "center",
            alignItems: "center",
            display: "flex",
            fontFamily: "Intro",
            justifyContent: "center",
            fontWeight: "bolder",
            fontSize: "1.8em",
          }}
        >
          TODAY'S
        </div>
        <div className="tableTop marginedEle">
          <div className="tabEle tabEle1 tabEleHeaD">Rank</div>
          <div
            className="tabEle tabEle2 tabEleHeaD nameHead"
            style={{ paddingLeft: "1.5vh" }}
          >
            Name
          </div>
          <div className="tabEle tabEle3 tabEleHeaD">Score</div>
        </div>

        <div className="tableBody marginedEle" id="tbScrool">
          {players.map((row, i) => {
            return (
              <div
                ref={
                  row._id === filters.activePlayerEventId
                    ? tableCellRef
                    : someRef
                }
                key={i}
                className={
                  i == 0
                    ? " tbleBody"
                    : i == 1
                    ? " tbleBody"
                    : i == 2
                    ? " tbleBody"
                    : "tbleBody commonEle"
                }
              >
                <div
                  className={
                    i == 0
                      ? "firstLb ulteriorParent upTop"
                      : i == 1
                      ? "secondLb ulteriorParent upTop"
                      : i == 2
                      ? "thirdLb ulteriorParent upTop"
                      : "ulteriorParent upBot "
                  }
                  style={
                    row._id === filters.activePlayerEventId
                      ? {
                          backgroundColor: "#f9ad49",
                          borderColor: "#f9ad49",
                        }
                      : null
                  }
                >
                  <div
                    align="center"
                    size="small"
                    // style={{ fontSize: "2.4em" }}
                    sx={{ color: "inherit", backgroundColor: "red" }}
                    className="tabEle tabEle1 tabEleBdy"
                  >
                    <div
                      style={{
                        width: "2.0vh",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div
                    align="center"
                    size="small"
                    sx={{ color: "inherit" }}
                    className="tabEle tabEle2 tabEleBdy"
                  >
                    {" "}
                    <div className="userName">
                      <img src={row.avatar} /> {row.name}
                    </div>
                  </div>
                  <div
                    align="center"
                    size="small"
                    sx={{ color: "inherit" }}
                    className="tabEle tabEle3 tabEleBdy"
                  >
                    {row.score}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="higlightsection"></div>
      <div
        className="bottomaddScroll"
        style={{ backgroundColor: "white" }}
        onClick={() => {
          // setVidScreen(true);
          setFirstVideo(true);
          // handlePlayVideo();
        }}
      >
        <MoveStuffAround />
      </div>
    </div>
  </div>