import logo from "./logo.svg";
import "./App.css";
import Registration from "./components/receptionist/Registration";
import Login from "./components/receptionist/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/superAdmin/Dashboard";
import Chart from "./components/superAdmin/dashboard/Charts/AveragePatientChart";
import Header from "./components/Header";
import Sider from "./components/Sider";
import UniversalLogin from "./pages/UniversalLogin";
import Apointment from "./pages/superAdmin/Apointment";
import Branches from "./pages/Branches";
import AddBranch from "./components/superAdmin/Branches/AddBranch";
import AllBills from "./pages/superAdmin/AllBills";
import Inventory from "./pages/superAdmin/Inventory";
import DoctorList from "./pages/superAdmin/DoctorList";
import SuperAdProfile from "./components/superAdmin/SuperAdProfile";
import DoctorProfile from "./components/superAdmin/doctor/EmployeeProfile";
import AddInventory from "./components/superAdmin/inventory-comp/AddInventory";
import EditInventory from "./components/superAdmin/inventory-comp/EditInventory";
import AddDoctor from "./components/superAdmin/doctor/AddDoctor";
import ClinicSetting from "./pages/superAdmin/ClinicSetting";
import LabSetting from "./pages/superAdmin/settings/LabSetting";
import FinancialReportCard from "./pages/superAdmin/FinancialReport/FinancialReportCard";
import ManageStaff from "./pages/superAdmin/ManageStaff";
import DrugSetting from "./pages/superAdmin/drug-setting/DrugSetting";
import PrescriptionTemplate from "./pages/superAdmin/Prescription-Templates/PrescriptionTemplate";
import CalenderSetting from "./pages/superAdmin/CalenderSettings/CalenderSetting";
import TreatmentSetting from "./pages/superAdmin/TreatmentSetting/TreatmentSetting";
import CommunicationSetting from "./pages/superAdmin/Communication-setting/CommunicationSetting";
import ReportDash from "./pages/superAdmin/AllReport/ReportDash";
import AppointmentReport from "./pages/superAdmin/AllReport/AppointmentReport";
import BillingReport from "./pages/superAdmin/AllReport/BillingReport";
import InventoryReport from "./pages/superAdmin/AllReport/InventoryReport";
import EmpAttendanceRepo from "./pages/superAdmin/AllReport/EmpAttendanceRepo";
import EmpDetailsRepo from "./pages/superAdmin/AllReport/EmpDetailsRepo";
import LabDetailsReport from "./pages/superAdmin/AllReport/LabDetailsReport";
import LabTestReport from "./pages/superAdmin/AllReport/LabTestReport";
import LabTaskReport from "./pages/superAdmin/AllReport/LabTaskReport";
import SuperAdmNotify from "./pages/superAdmin/SuperAdmNotify";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useEffect, useState } from "react";
import ErrorPage from "./pages/ErrorPage";
import ComplaintPage from "./pages/superAdmin/ComplaintPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/UserSlicer";
import { setBranch } from "./redux/slices/BranchSlicer";
import EmployeeProfile from "./components/superAdmin/doctor/EmployeeProfile";
import PatientDetailsLIst from "./pages/superAdmin/patientDetails/PatientDetailsLIst";
import PatientProfile from "./pages/superAdmin/patientDetails/PatientProfile";
import EmpComplaintsReport from "./pages/superAdmin/AllReport/EmpComplaintsReport";
import PasswordReset from "./pages/PasswordReset";
import StaffLeave from "./pages/superAdmin/StaffLeave";
import LabPatientReport from "./pages/superAdmin/AllReport/LabPatientReport";
import OralTest from "./pages/superAdmin/AllReport/LabReport/OralTest";
import BloodTest from "./pages/superAdmin/AllReport/LabReport/BloodTest";
import RadiologyTest from "./pages/superAdmin/AllReport/LabReport/RadiologyTest";
import PendingTest from "./pages/superAdmin/AllReport/LabReport/PendingTest";
import Compleated from "./pages/superAdmin/AllReport/LabReport/Compleated";
import FinalFinancialReport from "./pages/superAdmin/FinancialReport/FinalFinancialReport";
import axios from "axios";
import RefundedAmountReport from "./pages/superAdmin/AllReport/RefundedAmountReport";
import AllRefundList from "./pages/superAdmin/RefundAmountList/AllRefundList";
import ViewPatientTotalBill from "./pages/superAdmin/ViewPatientTotalBill";
import ClinicConfigSetting from "./pages/superAdmin/settings/ClinicConfigSetting";
import ViewSittingBill from "./pages/superAdmin/BillsView/ViewSittingBill";
import PrescriptionList from "./components/superAdmin/prescription/PrescriptionList";
import ViewPrescription from "./components/superAdmin/prescription/ViewPrescription";
import PatientBillsByTpid from "./pages/superAdmin/AllReport/BillReport/PatientBillsByTpid";

const App = () => {
  // const storedUserData = localStorage.getItem("userData");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user);
  const selectedBranch = localStorage.getItem("branchName");
  // console.log(selectedBranch);
  const branch = useSelector((state) => state.name);

  if (selectedBranch) {
    const branchName = JSON.parse(selectedBranch);
    dispatch(setBranch(branchName));
  }

  const [role, setRole] = useState("admin");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user.id !== null ? <Dashboard /> : <UniversalLogin />}
        />
        {/* ************************************************************************************ */}
        {/* super admin routes start  */}

        <Route path="/receptionist_login" element={<Login />} />
        {/* <Route
          path="/receptionist_registration"
          element={user.id === null ? <UniversalLogin /> : <Registration />}
        /> */}
        <Route
          path="/superadmin-dashboard"
          element={user.id === null ? <UniversalLogin /> : <Dashboard />}
        />
        <Route
          path="/super-admin-appointment"
          element={user.id === null ? <UniversalLogin /> : <Apointment />}
        />
        <Route
          path="/superadmin-branch"
          element={user.id === null ? <UniversalLogin /> : <Branches />}
        />
        <Route
          path="/superadmin-add-branch"
          element={user.id === null ? <UniversalLogin /> : <AddBranch />}
        />
        <Route
          path="/bill_section"
          element={user.id === null ? <UniversalLogin /> : <AllBills />}
        />
        {/* <Route
          path="/inventory"
          element={user.id === null ? <UniversalLogin /> : <Inventory />}
        /> */}
        <Route
          path="/add-invetory"
          element={user.id === null ? <UniversalLogin /> : <AddInventory />}
        />
        <Route
          path="/edit-invetory/:pid"
          element={user.id === null ? <UniversalLogin /> : <EditInventory />}
        />
        <Route
          path="/doctor_section"
          element={user.id === null ? <UniversalLogin /> : <DoctorList />}
        />
        <Route
          path="/register-doctor"
          element={user.id === null ? <UniversalLogin /> : <AddDoctor />}
        />
        <Route
          path="/super-admin-profile"
          element={user.id === null ? <UniversalLogin /> : <SuperAdProfile />}
        />
        <Route
          path="/employee-profile/:eid"
          element={user.id === null ? <UniversalLogin /> : <EmployeeProfile />}
        />
        <Route
          path="/clinic-setting"
          element={user.id === null ? <UniversalLogin /> : <ClinicSetting />}
        />
        <Route
          path="/clinic-config-setting"
          element={
            user.id === null ? <UniversalLogin /> : <ClinicConfigSetting />
          }
        />
        <Route
          path="/lab-setting"
          element={user.id === null ? <UniversalLogin /> : <LabSetting />}
        />
        <Route
          path="/drug-setting"
          element={user.id === null ? <UniversalLogin /> : <DrugSetting />}
        />
        <Route
          path="/calender-setting"
          element={user.id === null ? <UniversalLogin /> : <CalenderSetting />}
        />
        <Route
          path="/treatment-setting"
          element={user.id === null ? <UniversalLogin /> : <TreatmentSetting />}
        />
        <Route
          path="/communication-setting"
          element={
            user.id === null ? <UniversalLogin /> : <CommunicationSetting />
          }
        />
        <Route
          path="/prescription-templates"
          element={
            user.id === null ? <UniversalLogin /> : <PrescriptionTemplate />
          }
        />
        <Route
          path="/reports-dashboard"
          element={user.id === null ? <UniversalLogin /> : <ReportDash />}
        />
        <Route
          path="/finance-reports"
          element={
            user.id === null ? <UniversalLogin /> : <FinancialReportCard />
          }
        />
        <Route
          path="/finance-report-final"
          element={
            user.id === null ? <UniversalLogin /> : <FinalFinancialReport />
          }
        />
        <Route
          path="/appointment-report"
          element={
            user.id === null ? <UniversalLogin /> : <AppointmentReport />
          }
        />
        <Route
          path="/Billing-report"
          element={user.id === null ? <UniversalLogin /> : <BillingReport />}
        />
        <Route
          path="/inventory-report"
          element={user.id === null ? <UniversalLogin /> : <InventoryReport />}
        />
        <Route
          path="/employee-attendance-report"
          element={
            user.id === null ? <UniversalLogin /> : <EmpAttendanceRepo />
          }
        />
        <Route
          path="/employee-details-report"
          element={user.id === null ? <UniversalLogin /> : <EmpDetailsRepo />}
        />
        <Route
          path="/lab-details-report"
          element={user.id === null ? <UniversalLogin /> : <LabDetailsReport />}
        />
        <Route
          path="/lab-test-report"
          element={user.id === null ? <UniversalLogin /> : <LabTestReport />}
        />
        <Route
          path="/lab-task-report"
          element={user.id === null ? <UniversalLogin /> : <LabTaskReport />}
        />
        <Route
          path="/manage-staff"
          element={user.id === null ? <UniversalLogin /> : <ManageStaff />}
        />
        <Route
          path="/super-admin-notification"
          element={user.id === null ? <UniversalLogin /> : <SuperAdmNotify />}
        />
        <Route
          path="/complaint-page/:cid"
          element={user.id === null ? <UniversalLogin /> : <ComplaintPage />}
        />
        <Route
          path="/patient-list"
          element={
            user.id === null ? <UniversalLogin /> : <PatientDetailsLIst />
          }
        />
        <Route
          path="/patient-profile/:pid"
          element={user.id === null ? <UniversalLogin /> : <PatientProfile />}
        />
        <Route
          path="/emp-complaints-list"
          element={
            user.id === null ? <UniversalLogin /> : <EmpComplaintsReport />
          }
        />
        <Route path="/password-reset" element={<PasswordReset />} />

        <Route
          path="/leave-management"
          element={user.id === null ? <UniversalLogin /> : <StaffLeave />}
        />
        <Route
          path="/lab-patient-report"
          element={user.id === null ? <UniversalLogin /> : <LabPatientReport />}
        />

        <Route
          path="/OralTest"
          element={user.id === null ? <UniversalLogin /> : <OralTest />}
        />

        <Route
          path="/pathology-lab-test"
          element={user.id === null ? <UniversalLogin /> : <BloodTest />}
        />

        <Route
          path="/RadiologyTest"
          element={user.id === null ? <UniversalLogin /> : <RadiologyTest />}
        />

        <Route
          path="/PendingTest"
          element={user.id === null ? <UniversalLogin /> : <PendingTest />}
        />

        <Route
          path="/Compleated"
          element={user.id === null ? <UniversalLogin /> : <Compleated />}
        />

        <Route
          path="/refunded-amount-report"
          element={
            user.currentUser === null ? <UniversalLogin /> : <AllRefundList />
          }
        />

        <Route
          path="*"
          element={user.id === null ? <UniversalLogin /> : <ErrorPage />}
        />

        {/* <Route
          path="/ViewPatientTotalBill/:tpid"
          element={
            user.id === null ? <UniversalLogin /> : <ViewPatientTotalBill />
          }
        /> */}

        <Route
          path="/ViewSittingBill/:tpid/:sitting/:treatment/:appoint_id/:uhid"
          element={user.id === null ? <UniversalLogin /> : <ViewSittingBill />}
        />
        <Route
          path="/e-prescription"
          element={user.id === null ? <UniversalLogin /> : <PrescriptionList />}
        />
        <Route
          path="/view-prescription/:tpid"
          element={user.id === null ? <UniversalLogin /> : <ViewPrescription />}
        />
        <Route
          path="/ViewPatientTotalBill/:tpid"
          element={
            user.id === null ? <UniversalLogin /> : <PatientBillsByTpid />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
