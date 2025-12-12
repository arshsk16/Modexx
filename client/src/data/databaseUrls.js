
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const databaseUrls = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    editProfile: "/auth/profile/editprofile",
    addDoctor: "/auth/profile/adddoctor",
  },
  hospitals: {
    all: "/hospitalapi",
    fromId: "/hospitalapi/_id",
    bookHospital: "/hospitalapi/hospitals/_id/book",
    appointments: "/hospitalapi/appointments",
    emergency: "/hospitalapi/emergency",
  },
  patient: {
    appointments: "/patientapi/appointments",
  },
};
