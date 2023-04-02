import { FaTrash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";
import { GET_PROJECTS } from "../queries/projectQueries";

const ClientRow = ({ client }) => {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },

    //! setting the query object in an arr, might make sveral queries
    //! to display the changed/mutaded data on client side, do a refetchQueries
    //! to query the updated data once again. But could be too many queries - not
    //! best practice
    refetchQueries: [{ query: GET_CLIENTS, query: GET_PROJECTS }],

    //* in this case, use refetchQueries to not set one more query in update
    //* for GET_PROJECTS as well. 
    //? when you delete a client, the associated projects will delete as well
    //? then refetch even GET_PROJECTS to update on screen/client side


    //! better approach is update the cache
    //! through an update func, pass in cache as param, deleteClient mutation from clientMutation
    //! and we get the updated clients from the cache "cache.readQuery()", basically doing
    //! a query from the cache, not making a whole new request from db.
    /* update(cache, { data: { deleteClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      //? telling to cache how the data should be set! Filter out all the objects/data
      //? which those don't match the deleteClient id
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.filter((client) => client.id !== deleteClient.id),
        },
      });
    }, */
  });

  return (
    <tr>
      <td> {client.name} </td>
      <td> {client.email} </td>
      <td> {client.phone} </td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={deleteClient}>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default ClientRow;
