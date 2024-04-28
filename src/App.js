
import './App.css';
import { useEffect, useState } from 'react';
import { useUser } from './components/header/user';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert'
import ShoppingListDetail from './views/shopping-list-detail/ShoppingListDetail';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';

import { v4 as uuidv4 } from 'uuid';
import Lists from './components/lists/Lists';
import { createShoppingList, deleteShoppingList, getShoppingLists, updateShoppingList } from './api/apiCalls';

const defaultShoppingList = [
  {
    listId: "abcdf", ownerId: "123", membersIds: new Set(["234", "345"]),
    listName: "První shopping list",
    productsInList: [
      { productName: "Mléko", accomplished: false },
      { productName: "Mouka", accomplished: false },
      { productName: "Pažitka", accomplished: true },
      { productName: "Mléko1", accomplished: true },
      { productName: "Mouka2", accomplished: false },
      { productName: "Pažitka3", accomplished: true },
      { productName: "Mléko4", accomplished: true },
      { productName: "Mouka5", accomplished: false },
      { productName: "Pažitka6", accomplished: true },
    ],
    archived: false,
  },
  {
    listId: "fjowefjweoifj", ownerId: "234", membersIds: new Set(["123", "345", "456"]),
    listName: "Shopping list pro všechny",
    productsInList: [
      { productName: "Jablka", accomplished: false },
      { productName: "Citróny", accomplished: true },
      { productName: "Okurka", accomplished: true },
      { productName: "Máslo", accomplished: false }
    ],
    archived: false,
  },
  {
    listId: "aaaaaaaaa", ownerId: "234", membersIds: new Set(["123", "345", "456"]),
    listName: "Shopping list pro všechny",
    productsInList: [
      { productName: "Jablka", accomplished: true },
      { productName: "Citróny", accomplished: true },
      { productName: "Okurka", accomplished: true },
      { productName: "Máslo", accomplished: true }
    ],
    archived: true,
  }
]


function App() {
  const user = useUser();

  const [shoppingLists, setShoppingLists] = useState({ dataList: [], state: "", errors: [] });
  const [selectedShoppingList, setSelectedShoppingList] = useState(null);

  useEffect(() => {
    const getAllShoppingLists = async () => {
      try {
        setShoppingLists((prevShoppingLists) => ({
          ...prevShoppingLists,
          state: "pending",
        }));

        const response = await getShoppingLists();
        if (response.length > 0) {
          setShoppingLists((prevShoppingLists) => ({
            ...prevShoppingLists,
            dataList: response,
          }));
          setSelectedShoppingList(response[0]);
        }
        console.log("Response - get all shopping-lists: ", response);
      } catch (err) {
        setShoppingLists((prevShoppingLists) => ({
          ...prevShoppingLists,
          error: [...prevShoppingLists.error, err],
        }));
        console.error("Error:", err.message);
      } finally {
        setShoppingLists((prevShoppingLists) => ({
          ...prevShoppingLists,
          state: "done",
        }));
      }
    };

    getAllShoppingLists();
  }, []);


  useEffect(() => {
    console.log("Shopping lists: ", shoppingLists);
  }, [shoppingLists]);

  const shoppingListAction = async (action, data) => {

    function modifyProduct(action, data) {
      if (data?.listId && data?.productName) {
        const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
        if (listIndex > -1) {
          const productIndex = shoppingLists.dataList[listIndex].products.findIndex(
            (pr) => pr.productName === data.productName
          );
          if (productIndex > -1) {
            const updatedLists = [...shoppingLists.dataList];
            if (action === "add-product") {
              const productExists = updatedLists[listIndex].products.some(
                (pr) => pr.productName === data.product.productName
              );
              if (!productExists) {
                updatedLists[listIndex].products.push(data.product);
              } else {
                throw new Error(`Product with name '${data.product.productName}' is already in the list.`);
              }
            } else if (action === "remove-product") {
              updatedLists[listIndex].products.splice(productIndex, 1);
            } else {
              throw new Error(`Invalid action: ${action}`);
            }
            setShoppingLists({ ...shoppingLists, dataList: updatedLists });
          } else {
            throw new Error(`Product with name '${data.productName}' not found in the list.`);
          }
        } else {
          throw new Error(`List with ID '${data.listId}' not found.`);
        }
      } else {
        throw new Error("Required data fields (listId, productName) are missing.");
      }
    }

    try {
      if (action === "add-product") {
        if (data?.listId && data?.product?.productName) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productExists = shoppingLists.dataList[listIndex].productsInList.some(
              (pr) => pr.productName === data.product.productName
            );
            if (!productExists) {
              const updatedLists = [...shoppingLists.dataList];
              updatedLists[listIndex].productsInList.push(data.product);

              const response = await updateShoppingList(updatedLists[listIndex]);
              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));

              // setShoppingLists({ ...shoppingLists, dataList: updatedLists });
            } else {
              throw new Error(`Product with name '${data.product.productName}' is already in the list.`);
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        }
      }
      else if (action === "remove-product") {
        if (data?.listId && data?.productName) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productIndex = shoppingLists.dataList[listIndex].productsInList.findIndex(
              (pr) => pr.productName === data.productName
            );
            if (productIndex > -1) {
              const updatedLists = [...shoppingLists.dataList];
              updatedLists[listIndex].productsInList.splice(productIndex, 1);

              const response = await updateShoppingList(updatedLists[listIndex]);

              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));
              // setShoppingLists({ ...shoppingLists, dataList: updatedLists });
            } else {
              throw new Error(`Product with name '${data.productName}' not found in the list.`);
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        }
      }
      else if (action === "toggle-product-accomplished") {
        if (data?.listId && data?.productName) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productIndex = shoppingLists.dataList[listIndex].productsInList.findIndex(
              (pr) => pr.productName === data.productName
            );
            if (productIndex > -1) {
              const updatedLists = [...shoppingLists.dataList];
              updatedLists[listIndex].productsInList[productIndex].accomplished = !updatedLists[listIndex].productsInList[productIndex].accomplished;

              const response = await updateShoppingList(updatedLists[listIndex]);

              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));
              // setShoppingLists({ ...shoppingLists, dataList: updatedLists });
            } else {
              throw new Error(`Product with name '${data.productName}' not found in the list.`);
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        }
      }

      else if (action === "edit-list-name") {
        if (data?.listId && data?.listName) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            if (shoppingLists.dataList[listIndex].ownerId === user.id) {
              const updatedLists = [...shoppingLists.dataList];
              updatedLists[listIndex].listName = data.listName;

              const response = await updateShoppingList(updatedLists[listIndex]);
              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));
            } else {
              throw new Error("Current user is not owner of this list");
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        } else {
          throw new Error("Required data fields (listId, listName, ownerId) are missing.");
        }
      }
      else if (action === "add-list-member") {
        console.log("Data: ", data);
        if (data?.listId && data?.newMemberId) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            console.log("user: ", user);
            console.log("shoppinglist[index]", shoppingLists.dataList[listIndex]);
            if (shoppingLists.dataList[listIndex].ownerId === user.id) {
              const updatedLists = [...shoppingLists.dataList];
              updatedLists[listIndex].membersIds.push(data.newMemberId);

              const response = await updateShoppingList(updatedLists[listIndex]);

              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));
            } else {
              throw new Error("Current user is not owner of this list");
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        } else {
          throw new Error("Required data fields (listId, newMemberId) are missing.");
        }
      }
      else if (action === "remove-list-member") {
        if (data?.listId && data?.removeMemberId) {
          const listIndex = shoppingLists.dataList.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            if (shoppingLists.dataList[listIndex].ownerId !== data.removeMemberId) {
              const updatedLists = [...shoppingLists.dataList];

              const memberIndex = updatedLists[listIndex].membersIds.findIndex(data.removeMemberId);
              updatedLists[listIndex].membersIds.splice(memberIndex, 1);

              console.log("updatedLists: ", updatedLists);

              const response = await updateShoppingList(updatedLists[listIndex]);

              setShoppingLists((prevShoppingLists) => ({
                ...prevShoppingLists,
                dataList: updatedLists,
              }));
            } else {
              throw new Error("Current user is owner of this list so he can't be deleted");
            }
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        } else {
          throw new Error("Required data fields (listId, newMemberId) are missing.");
        }
      }
      else if (action === "create-list") {
        if (data.list) {
          const list = data.list;

          list.listId = uuidv4();
          console.log(list);

          const response = await createShoppingList(list);
          if (response.listObject) {
            setShoppingLists((prevShoppingLists) => ({
              ...prevShoppingLists,
              dataList: [...prevShoppingLists.dataList, response.listObject]
            }));
          }


          return list;
        }
        else {
          throw new Error("list is not an object");
        }
      }
      else if (action === "delete-list") {
        if (data.listId) {
          const listIndex = shoppingLists.dataList.findIndex((list) => list.listId === data.listId);
          if (listIndex > -1) {
            const updatedLists = [...shoppingLists.dataList];
            updatedLists.splice(listIndex, 1); // Remove the list at the found index

            const response = await deleteShoppingList(data.listId);

            setShoppingLists((prevShoppingLists) => ({
              ...prevShoppingLists,
              dataList: updatedLists,
            }));

            setSelectedShoppingList(updatedLists.length > 0 ? updatedLists[0] : null);

            return "removed";
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        }
        else {
          throw new Error("listId not is empty string");
        }
      }
      else if (action === "archive-list") {
        if (data.listId) {
          const listIndex = shoppingLists.dataList.findIndex((list) => list.listId === data.listId);
          if (listIndex > -1) {
            const newList = { ...shoppingLists.dataList[listIndex], archived: true };
            const updatedLists = [...shoppingLists.dataList];
            updatedLists[listIndex] = newList;

            const response = await updateShoppingList(updatedLists[listIndex]);

            setShoppingLists((prevShoppingLists) => ({
              ...prevShoppingLists,
              dataList: updatedLists,
            }));

            // setShoppingLists({ ...shoppingLists, dataList: updatedLists });
            return "archived";
          } else {
            throw new Error(`List with ID '${data.listId}' not found.`);
          }
        }
        else {
          throw new Error("listId not is empty string");
        }
      }


      else {
        console.warn("There is no such action as: ", action);
        return false;
      }
      return true;
    }
    catch (error) {
      console.error(`shopping list action (${action}) failed: `, error);
      setShoppingLists((prevShoppingLists) => ({
        ...prevShoppingLists,
        errors: [...prevShoppingLists.errors, error],
      }));
      //throw error;
      return false;
    }
  }

  return (
    <>     

      <Header
        shoppingLists={shoppingLists.dataList}
        shoppingListAction={shoppingListAction}
        selectedShoppingList={selectedShoppingList}
        setSelectedShoppingList={setSelectedShoppingList}
        state={shoppingLists.state}
      />

      <Container>
        {shoppingLists.errors.map((error, i) => {
          return <Alert variant="danger" key={i} dismissible>{error.toString()}</Alert>
        })}

        <Row>
          <Col xs={12} xl={7} className="">
            <main>             
              {selectedShoppingList ?
                <ShoppingListDetail
                  shoppingList={selectedShoppingList}
                  shoppingListAction={shoppingListAction}
                />
                :
                <Alert variant="danger">
                  No shopping list selected (if none are present - we would be happy if you could create one)
                </Alert>
              }
            </main>
          </Col>
          <Col xl={5} className="mt-4 d-none d-xl-block" style={{ backgroundColor: "#f4f4f4" }}>

            <Row className=" mb-3 container-fluid ">
              <h1>Shopping lists:</h1>
            </Row>

            <Row >
              <Lists
                shoppingListAction={shoppingListAction}
                shoppingLists={shoppingLists.dataList}
                state={shoppingLists.state}
                selectedShoppingList={selectedShoppingList}
                setSelectedShoppingList={setSelectedShoppingList}
              />
            </Row>

          </Col>
        </Row>
      </Container>

      <Footer />
      <div style={{ width: "100%", height: "75px" }}></div>
    </>
  );
}

export default App;
