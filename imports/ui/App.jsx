import React from 'react';
import RedisVent from '../api/classes/client/RedisVent';

export const App = () => {
  RedisVent.Names.prepareCollection("names")
  const db = RedisVent.Names.getCollection("names");

  const [data, setData] = React.useState([])
  React.useEffect(() => {
    Meteor.call("getData", "123", (err, res) => {
      if (err) {
        console.log(err)
      } else {
        if (res.length) {
          res.forEach(element => {
            db.insert(element)
          });
          setData(res)
        }
      }
    })
    RedisVent.Names.listen("names", "123", ({ event, data }) => {
      console.log(data);
      let id, name;
      if (event === "remove") {
        id = data._id
      } else {
        id = data.data.id
        name = data.data.name;
      }

      switch (event) {
        case "insert":
          break;
        case "remove":
          db.remove({ id })
          break
        case "upsert":
          break;
        case "mutate":
          db.update({ id }, { $set: { name } })
          db.insert({ name: "New Name" })
          break;
        case "update":
          db.update({ id }, { $set: { name } })
          break;
      }
      const res = db.find().fetch()
      setData(res)
    })
  }, [])

  return (

    <div>
      <h1>Welcome to Meteor!</h1>
      <div style={{ height: "200px", width: 300, overflow: "auto", }}>
        {data.length ? data.map((d, i) => {
          return <div key={i}>{d.name} {d.occupation ? d.occupation : ""}</div>
        }) : ""}
      </div>
    </div>
  )
}

