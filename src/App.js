
import './App.css';
import { useState } from 'react';
import { useUser } from './components/header/user';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShoppingListDetail from './views/shopping-list-detail/ShoppingListDetail';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';

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
    archived: null,
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
    archived: null,
  }
]


function App() {
  const [shoppingLists, setShoppingLists] = useState(defaultShoppingList);
  const user = useUser();

  const shoppingListAction = (action, data) => {

    function modifyProduct(action, data) {
      if (data?.listId && data?.productName) {
        const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
        if (listIndex > -1) {
          const productIndex = shoppingLists[listIndex].products.findIndex(
            (pr) => pr.productName === data.productName
          );
          if (productIndex > -1) {
            const updatedLists = [...shoppingLists];
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
            setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productExists = shoppingLists[listIndex].productsInList.some(
              (pr) => pr.productName === data.product.productName
            );
            if (!productExists) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].productsInList.push(data.product);
              setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productIndex = shoppingLists[listIndex].productsInList.findIndex(
              (pr) => pr.productName === data.productName
            );
            if (productIndex > -1) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].productsInList.splice(productIndex, 1);
              setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            const productIndex = shoppingLists[listIndex].productsInList.findIndex(
              (pr) => pr.productName === data.productName
            );
            if (productIndex > -1) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].productsInList[productIndex].accomplished = !updatedLists[listIndex].productsInList[productIndex].accomplished;
              setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            if (shoppingLists[listIndex].ownerId === user.id) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].listName = data.listName;
              setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            console.log("user: ", user);
            console.log("shoppinglist[index]", shoppingLists[listIndex]);
            if (shoppingLists[listIndex].ownerId === user.id) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].membersIds.add(data.newMemberId);
              setShoppingLists(updatedLists);
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
          const listIndex = shoppingLists.findIndex((ls) => ls.listId === data.listId);
          if (listIndex > -1) {
            if (shoppingLists[listIndex].ownerId !== data.removeMemberId) {
              const updatedLists = [...shoppingLists];
              updatedLists[listIndex].membersIds.delete(data.removeMemberId);
              console.log("updatedLists: ", updatedLists);
              setShoppingLists(updatedLists);
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
      else {
        console.warn("There is no such action as: ", action);
        return false;
      }
      return true;
    }
    catch (error) {
      console.error(`shopping list action (${action}) failed: `, error);
      return false;
    }
  }

  return (
    <>
      <Header />

      <Container>

        <Row>
          <Col xs={12} xl={7} className="">
            <main>
              <ShoppingListDetail
                shoppingList={shoppingLists[0]}
                shoppingListAction={shoppingListAction}
              />
            </main>
          </Col>
          <Col xl={5} className=" d-none d-xl-block">
            <Row className="mt-4 container-fluid bg-warning">
              <h1>Shopping lists:</h1>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default App;
