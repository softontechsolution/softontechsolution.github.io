import React, { useEffect, useState } from "react";
import { db } from "../firebase/fireConfig";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as ReactBootstrap from "react-bootstrap";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

function AccidentAlert() {
  const [loading, setLoading] = useState(false);
  const [accidentAlertData, setaccidentAlert] = useState([]);

  let lastItem = [];
  let lastId = [];
  let lastGeoLat = [];
  let lastGeoLong = [];
  let lastTimestamp = [];

  useEffect(() => {
    db.collection("data")
      .doc("MP10ME7969")
      .collection("accident_alert")
      .orderBy("id", "asc")
      .onSnapshot((docs) => {
        const accident_value = [];
        docs.forEach((doc) => {
          accident_value.push(doc.data());
        });
        setaccidentAlert(accident_value);
        setLoading(true);
      });
  }, []);

  // last record from data...
  Object.keys(accidentAlertData).map((key) => {
    lastItem = accidentAlertData[key];
    const obj = Object.entries(lastItem);
    obj.forEach(([key, value]) => {
      if (key === "id") {
        lastId.push(value);
      }
      if (key === "geolocation_lat") {
        lastGeoLat.push(value);
      }
      if (key === "geolocation_long") {
        lastGeoLong.push(value);
      }
      if (key === "timestamp") {
        lastTimestamp.push(value);
      }
    });
    return 0;
  });

  //   define data in table accending order
  const columns = [
    {
      text: "ID",
      dataField: "id",
    },
    {
      text: "LATITUDE",
      dataField: "geolocation_lat",
    },
    {
      text: "LONGITUDE",
      dataField: "geolocation_long",
    },
    {
      text: "TIMESTAMP",
      dataField: "timestamp",
    },
  ];
  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  // export to CSV
  const { SearchBar, ClearSearchButton } = Search;

  return (
    <div className="fuelTheftAlert">
      <div className="fuelTheftAlert_table">
        {loading ? (
          <ToolkitProvider
            bootstrap4
            keyField="id"
            data={accidentAlertData}
            columns={columns}
            search
          >
            {(props) => (
              <div>
                <div className="fuelTheftAlert_btn h6 text-right mb-1">
                  <SearchBar {...props.searchProps} />
                  <ClearSearchButton
                    className="btn btn-success"
                    {...props.searchProps}
                  />
                </div>
                <hr />
                <BootstrapTable
                  defaultSorted={defaultSorted}
                  pagination={paginationFactory()}
                  {...props.baseProps}
                />
              </div>
            )}
          </ToolkitProvider>
        ) : (
          <ReactBootstrap.Spinner animation="border" />
        )}
      </div>
    </div>
  );
}

export default AccidentAlert;
