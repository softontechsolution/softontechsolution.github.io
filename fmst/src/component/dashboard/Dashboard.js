import React, { useState } from "react";
import { db } from "../firebase/fireConfig";
import HeaderLayout from "../dashboard_common/HeaderLayout";
import FooterLayout from "../dashboard_common/FooterLayout";
import SpeedLog from "../Logs/SpeedLog";
import FuelLog from "../Logs/FuelLog";
import FuelRefillLog from "../Logs/FuelRefillLog";
import MaintainenceLog from "../Logs/MaintainenceLog";
import OverSpeedLog from "../Logs/OverSpeedLog";
import AccidentAlert from "../Logs/AccidentAlert";
import FuelTheftAlert from "../Logs/FuelTheftAlert";
import { Layout, Menu, Breadcrumb, Divider } from "antd";
import { Button } from "antd";
import NavigationIcon from "@material-ui/icons/Navigation";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
} from "mdbreact";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import LocalTaxiIcon from "@material-ui/icons/LocalTaxi";
import PostAddIcon from "@material-ui/icons/PostAdd";
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import "./Dashboard.css";

function Alert(props) {
  return <MuiAlert elevation={3} variant="filled" {...props} />;
}

function Dashboard() {
  // Layout and Menu
  const { Content, Sider } = Layout;
  const { SubMenu } = Menu;

  // report an issue preventDefault
  const preventDefault = (event) => {
    event.preventDefault();
    window.location.href =
      "https://github.com/abhishekpatel946/Smart-Vehicle-Fleet-Manager/issues/new/choose";
  };

  // snakbar state
  const [vehicleAddSuccess, setvehicleAddSuccess] = React.useState(false);
  const [vehicleAddError, setvehicleAddError] = React.useState(false);
  const [maintainanceAddSuccess, setmaintainanceAddSuccess] = React.useState(
    false
  );
  const [maintainanceAddError, setmaintainanceAddError] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setvehicleAddSuccess(false);
    setvehicleAddError(false);
    setmaintainanceAddSuccess(false);
    setmaintainanceAddError(false);
  };

  // vehicleId & vehicleName for addVehicle
  const [vehicleNAME, setVehicleNAME] = useState("");
  const [vehicleID, setVehicleID] = useState("");

  // vehicleName, dateTime & cost for maintenace
  const [vehicleRegNumber, setVehicleRegNumber] = useState("");
  const [date, setDate] = useState(moment().toString());
  const [cost, setCost] = useState("");

  // set date
  const onDateChange = (val) => {
    setDate(val);
  };

  const [collapseState, setCollapseState] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapseState({ collapsed });
  };

  // form onSubmit handler
  const submitHandler = (event) => {
    event.preventDefault();
    event.target.className += " was-validated";
  };

  // fetch vehicle model & regid
  // const [vehicleInfo, setVehicleInfo] = useState([]);
  // let vehicleModel = "";
  // let vehicleModelId = "";
  // db.collection("data")
  //   .doc("MP10ME7969")
  //   .get()
  //   .then((snapshot) => {
  //     const currentInfo = [];
  //     snapshot.forEach((doc) => {
  //       currentInfo.push(doc.data());
  //     });
  //     setVehicleInfo(currentInfo);
  //   });
  // vehicleInfo.forEach((data) => {
  //   vehicleModel = data.vehicleId;
  //   vehicleModelId = data.vehicleName;
  // });

  // fetch moduleState
  const [moduleState, setModuleState] = useState([]);
  let liveState = false;
  db.collection("data")
    .doc("MP10ME7969")
    .collection("module_state")
    .onSnapshot((docs) => {
      const currentState = [];
      docs.forEach((doc) => {
        currentState.push(doc.data());
      });
      setModuleState(currentState);
    });

  moduleState.forEach((data) => {
    liveState = data.state;
  });

  // form vehicleRegister submitHandler
  const vehicleRegister = (event) => {
    if (vehicleID && vehicleNAME) {
      // check if the doc are already available in the DB... then just give the warning to the user!

      // create a doc in DB with vehicleID and set it fields
      db.collection("data").doc(vehicleID).set({
        vehicleId: vehicleID,
        vehicleName: vehicleNAME,
      });

      // create a dummy collection for newly created vehicleID
      db.collection("data").doc(vehicleID).collection("fuel").doc().set({
        id: "0",
        amount: "0",
        timestamp: "0",
      });
      db.collection("data").doc(vehicleID).collection("fuel_refill").doc().set({
        id: "0",
        amount: "0",
        timestamp: "0",
      });
      db.collection("data")
        .doc(vehicleID)
        .collection("maintainance")
        .doc()
        .set({
          id: "0",
          amount: "0",
          timestamp: "0",
        });
      db.collection("data").doc(vehicleID).collection("overspeed").doc().set({
        id: "0",
        speed: "0",
        timestamp: "0",
      });
      db.collection("data").doc(vehicleID).collection("speed").doc().set({
        id: "0",
        speed: "0",
        timestamp: "0",
      });
      db.collection("data")
        .doc(vehicleID)
        .collection("accident_alert")
        .doc()
        .set({
          id: "0",
          accident: "0",
          geolocation_lat: "0",
          geolocation_long: "0",
          timestamp: "0",
        });
      db.collection("data")
        .doc(vehicleID)
        .collection("fuel_theft_alert")
        .doc()
        .set({
          id: "0",
          fuelTheft: "0",
          geolocation_lat: "0",
          geolocation_long: "0",
          timestamp: "0",
        });
      db.collection("data")
        .doc(vehicleID)
        .collection("module_state")
        .doc()
        .set({
          state: "0",
        });

      // success mgs for the all are right
      setvehicleAddError(false);
      setmaintainanceAddSuccess(false);
      setmaintainanceAddError(false);
      setvehicleAddSuccess(true);

      // set it to defualt to state
      setVehicleNAME("");
      setVehicleID("");
    } else {
      // alert("Both the fields are mandatory!!!");
      setvehicleAddSuccess(false);
      setmaintainanceAddSuccess(false);
      setmaintainanceAddError(false);
      setvehicleAddError(true);
    }
  };

  // from vehicleMaintenace submitHandler
  const addCost = (event) => {
    // store maintainance-cost into database
    db.collection("data")
      .doc(vehicleRegNumber)
      .collection("maintainance")
      .add({
        id: vehicleRegNumber,
        cose: cost,
        timestamp: date,
      })
      .then(function () {
        // success mgs for the all are right
        setvehicleAddSuccess(false);
        setvehicleAddError(false);
        setmaintainanceAddError(false);
        setmaintainanceAddSuccess(true);
      })
      .catch(function (error) {
        setvehicleAddSuccess(false);
        setvehicleAddError(false);
        setmaintainanceAddSuccess(false);
        setmaintainanceAddError(true);
      });
  };

  // render() {
  return (
    <Layout id="header">
      {/* Header Section */}
      <HeaderLayout className="header" />
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapseState.collapsed}
          onCollapse={onCollapse}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["stats"]}
            defaultOpenKeys={["track"]}
            mode="inline"
          >
            <Menu.Item key="stats" icon={<PieChartOutlined />}>
              Stats
            </Menu.Item>
            <SubMenu key="track" icon={<DesktopOutlined />} title="Track">
              <Menu.Item key="speed">
                <Link href="#speedSection">Speed</Link>
              </Menu.Item>
              <Menu.Item key="fuel">
                <Link href="#fuelSection">Fuel</Link>
              </Menu.Item>
              <Menu.Item key="fuel_refill">
                <Link href="#fuelRefillSection">Fuel Refill</Link>
              </Menu.Item>
              <Menu.Item key="overspeeding">
                <Link href="#overSpeedingSection">OverSpeeding</Link>
              </Menu.Item>
              <Menu.Item key="maintainance">
                <Link href="#maintainanceSection">Maintainance</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="accidentAlert"
              icon={<NotificationsActiveOutlinedIcon />}
            >
              <Link href="#accidentAlertSection">Accident alert</Link>
            </Menu.Item>
            <Menu.Item
              key="fuelTheftAlert"
              icon={<NotificationImportantIcon />}
            >
              <Link href="#fuelTheftAlertSection">FuelTheft alert</Link>
            </Menu.Item>
            <Menu.Item key="addVehicle" icon={<LocalTaxiIcon />}>
              <Link href="#addVehicleSection">Add Vehicle</Link>
            </Menu.Item>
            <Menu.Item key="addMaintainance" icon={<PostAddIcon />}>
              <Link href="#addVehicleSection">Add Maintainance</Link>
            </Menu.Item>
            <Menu.Item key="reportIssue" icon={<ReportProblemOutlinedIcon />}>
              <Link
                href="https://github.com/abhishekpatel946/Smart-Vehicle-Fleet-Manager/issues/new/choose"
                onClick={preventDefault}
              >
                Report an issue
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Breadcrum Naming */}
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <div>
                <p className="h6 text-left mb-1">
                  Status : {liveState ? "Active" : "Inactive"}
                  {/* {vehicleModel}
                  {vehicleModelId} */}
                </p>
              </div>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 560 }}
            >
              {/* Speed Section */}
              <Divider orientation="left" id="speedSection">
                Speed area
              </Divider>
              <MDBContainer>
                <SpeedLog />
              </MDBContainer>

              {/* Fuel Section */}
              <Divider orientation="left" id="fuelSection">
                Fuel area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <FuelLog />
                </MDBRow>
              </MDBContainer>

              {/* OverSpeeding Section */}
              <Divider orientation="left" id="overSpeedingSection">
                OverSpeeding area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <OverSpeedLog />
                </MDBRow>
              </MDBContainer>

              {/* Fuel Refill Section */}
              <Divider orientation="left" id="fuelRefillSection">
                Fuel Refill area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <FuelRefillLog />
                </MDBRow>
              </MDBContainer>

              {/* Maintainence Section */}
              <Divider orientation="left" id="maintainanceSection">
                Maintainance area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <MaintainenceLog />
                </MDBRow>
              </MDBContainer>

              {/* Accident Section */}
              <Divider orientation="left" id="accidentAlertSection">
                Accident Alert area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <AccidentAlert />
                </MDBRow>
              </MDBContainer>

              {/* FuelTheft Section */}
              <Divider orientation="left" id="fuelTheftAlertSection">
                FuelTheft Alert area
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <FuelTheftAlert />
                </MDBRow>
              </MDBContainer>

              {/* addVehicle Section */}
              <Divider orientation="left" id="addVehicleSection">
                Add Vehicle
              </Divider>
              <MDBContainer>
                <MDBRow>
                  <MDBCol md="6">
                    <form
                      className="needs-validation"
                      onSubmit={submitHandler}
                      noValidate
                    >
                      <p className="h5 text-center mb-4">Register Vehicle</p>
                      <div className="grey-text">
                        <MDBInput
                          className="addVehicle_vehicleNAME"
                          name="vehicleNAME"
                          onChange={(event) =>
                            setVehicleNAME(event.target.value)
                          }
                          value={vehicleNAME}
                          label="Your vehicle name"
                          icon="car"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                        <MDBInput
                          className="addVehicle_vehicleID"
                          name="vehicleID"
                          onChange={(event) => setVehicleID(event.target.value)}
                          value={vehicleID}
                          label="Your vechile reg. number"
                          icon="registered"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <MDBBtn outline type="submit" onClick={vehicleRegister}>
                          Register
                          <MDBIcon className="ml-1" />
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCol>
                  <MDBCol md="6">
                    <form
                      className="needs-validation"
                      onSubmit={submitHandler}
                      noValidate
                    >
                      <p className="h5 text-center mb-4">
                        Register Maintainance
                      </p>
                      <div className="grey-text">
                        <MDBInput
                          className="addVehicle_vehicleNAME"
                          name="vehicleName"
                          onChange={(event) =>
                            setVehicleRegNumber(event.target.value)
                          }
                          value={vehicleRegNumber}
                          label="Your vehicle Reg number"
                          icon="registered"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                        <div>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              fullWidth
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="date-picker-inline"
                              label="DD/MM/YYYY"
                              value={date}
                              onChange={onDateChange}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                        <MDBInput
                          className="addVehicle_vehicleID"
                          name="cost"
                          onChange={(event) => setCost(event.target.value)}
                          value={cost}
                          label="Your mainatenace cost..."
                          icon="rupee-sign"
                          group
                          type="text"
                          validate
                          error="wrong"
                          success="right"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <MDBBtn outline type="submit" onClick={addCost}>
                          Add Cost
                          <MDBIcon className="ml-1" />
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>

              {/* back to top */}
              <Link href="#header">
                <Button
                  // ghost
                  icon={<NavigationIcon />}
                  style={{
                    float: "right",
                    margin: "auto 20px 10px 20px",
                  }}
                >
                  {" "}
                  Back to top{" "}
                </Button>
              </Link>

              {/* End */}
            </div>
          </Content>

          {/* snakbar notifiers */}
          <Snackbar
            open={vehicleAddSuccess}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              Vehicle added successfully.
            </Alert>
          </Snackbar>
          <Snackbar
            open={vehicleAddError}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              All the field's are mendatory!!!
            </Alert>
          </Snackbar>
          <Snackbar
            open={maintainanceAddSuccess}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              Maintainance added successfully.
            </Alert>
          </Snackbar>
          <Snackbar
            open={maintainanceAddError}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              All the field's are mendatory!!!
            </Alert>
          </Snackbar>

          {/* footer */}
          <FooterLayout />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
