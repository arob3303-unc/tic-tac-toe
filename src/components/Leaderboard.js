import React, { useEffect, useState } from "react";

function Leaderboard(refresh) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaders(data))
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div className="leaderboard-component">
        <div className="leaderboard-title">
            <h2>🏆 Leaderboard</h2>
        </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((player, index) => (
            <tr key={player.username}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;