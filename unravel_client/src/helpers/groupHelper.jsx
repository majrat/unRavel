import axios from "axios";
import Swal from "sweetalert2";

export const getAllGroups = async () => {
  const res = await axios.get("http://localhost:8080/api/user/get_all_groups");
  if (res?.data) {
    return res?.data;
  } else {
    Swal.fire({
      title: "No trips found in the database",
      text: "No trips data found. Database empty",
      icon: "warning",
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
    });
  }
};

export async function getCurrentGroup(link_group_id) {
  try {
    const res = await axios.get("http://localhost:8080/api/user/get_group", {
      params: link_group_id,
    });

    if (res?.data) {
      // setGroup(res?.data);
      // setMembers(res?.data?.members);
      return res?.data;
    } else {
      Swal.fire({
        title: "No group found in the database",
        text: "No group data found. Database empty",
        icon: "warning",
        allowOutsideClick: false,
        confirmButtonColor: "#3085d6",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "User might be logged out --" + err,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
