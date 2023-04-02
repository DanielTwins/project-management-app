import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { DELETE_PROJECT } from "../mutations/projectMutations";
import { GET_PROJECTS } from "../queries/projectQueries";
import { useMutation } from "@apollo/client";

export default function DeleteProjectButton({ projectId }) {
  const navigate = useNavigate();

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: { id: projectId },

    //! using refetchQueries this time instead of update the cache
    refetchQueries: [{ query: GET_PROJECTS }],

    // using useNavigate from router-dom to navigate somewhere after completing
    // in this case navigate to homepage
    onCompleted: () => navigate("/"),
  });

  // const deleteProject = () => {};

  return (
    <div className="d-flex mt-5 ms-auto">
      <button className="btn btn-danger m-2" onClick={deleteProject}>
        <FaTrash className="icon" /> Delete Project
      </button>
    </div>
  );
}
