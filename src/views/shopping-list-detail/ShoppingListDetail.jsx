import React, { useEffect, useState } from "react";
import IconButton from "../../components/buttons/IconButton";
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductsList from "../../components/products-list/ProductsList";
import { faArrowRightToBracket, faBookBookmark, faCircle, faCircleMinus, faCirclePlus, faEllipsisV, faEye, faEyeSlash, faPen, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { USERS, useUser } from "../../components/header/user";
import BasicModal from "../../components/modals/BasicModal";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import Form from 'react-bootstrap/Form';

const ShoppingListDetail = (prop) => {
    const { shoppingList, shoppingListAction } = prop;

    const [modalVersion, setModalVersion] = useState("");
    const [formChanged, setFormChange] = useState(false);
    const [productName, setProductName] = useState("");
    const [listName, setListName] = useState("");
    const [showAccomplished, setShowAccomplished] = useState(false);

    const user = useUser();

    const addProductHandler = () => {
        console.log("adding product");
        const result = shoppingListAction("add-product",
            {
                listId: shoppingList.listId,
                product: { productName: productName, accomplished: false }
            });
        setProductName("");
        closeModal();
        console.log("result: ", result);
    }
    const renameListHandler = () => {
        console.log("edit-list-name");
        const result = shoppingListAction("edit-list-name",
            {
                listId: shoppingList.listId,
                listName: listName
            });
        closeModal();
        console.log("result: ", result);

    }
    const leaveListHandler = () => {
        console.log("leaving list");
        const result = shoppingListAction("remove-list-member",
            {
                listId: shoppingList.listId,
                removeMemberId: user.id
            });
        closeModal();
        console.log("result: ", result);
    }
    const removeUserHandler = (memberToRemove) => {
        console.log("removing user from list");
        const result = shoppingListAction("remove-list-member",
            {
                listId: shoppingList.listId,
                removeMemberId: memberToRemove
            });
        // closeModal();
        console.log("result: ", result);
    }
    const addlistMemberHandler = (memberToAdd) => {
        console.log("adding user to list");
        const result = shoppingListAction("add-list-member",
            {
                listId: shoppingList.listId,
                newMemberId: memberToAdd
            });
        // closeModal();
        console.log("result: ", result);
    }

    // TODO - next homework
    const archiveListHandler = () => {
        console.log("archiving list");
        const result = shoppingListAction("archive-list", {
            listId: shoppingList.listId,
        });
        console.log("result: ", result);
        closeModal();
    }
    const deleteListHandler = () => {
        console.log("removing list");
        const result = shoppingListAction("delete-list", {
            listId: shoppingList.listId,
        });
        console.log("result: ", result);
        closeModal();
    }

    const closeModal = () => {
        setFormChange(false);
        setModalVersion("");
    }

    const showModal = (modalVersion) => {
        const possibleModal = [
            "view-list-members", "leave-list", "add-product", "rename-list", "remove-list",
            "delete-list", "archive-list",
        ];

        if (possibleModal.includes(modalVersion)) {
            setModalVersion(modalVersion);
        }
        else { console.warn("unknown modalVersion name"); }
    }

    useEffect(() => {
        console.log("shoppingList: ", shoppingList);
        setListName(shoppingList.listName);
    }, [shoppingList]);


    if (!shoppingList) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading List Detail...</span>
            </Spinner>
        )
    }

    if (shoppingList.ownerId === user.id || shoppingList.membersIds.has(user.id)) {

        return (
            <>
                {/* ADD PRODUCT MODAL*/}
                <BasicModal
                    visible={modalVersion === "add-product"}
                    title="Add product"
                    closeButtonText="Close"
                    actionButtonText="Add"
                    onActionButtonClick={addProductHandler}
                    actionButtonDisabled={!productName}
                    onCloseButtonClick={closeModal}
                >
                    {/* validate={validate} */}
                    <Form noValidate onSubmit={addProductHandler}>
                        <Row >
                            <Form.Group as={Col} controlId="validataionProductName">
                                <Form.Label>Product Name:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nová položka..."
                                    value={productName}
                                    isValid={productName && formChanged}
                                    onChange={(val) => { setFormChange(true); setProductName(val.target.value); }}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </BasicModal>

                {/* CREATE LIST MODAL */}
                {/* <BasicModal
                    visible={modalVersion === "create-list"}
                    title="Create new list"
                    closeButtonText="Close"
                    actionButtonText="Create"
                    onActionButtonClick={createNewListHandler}
                    onCloseButtonClick={closeModal}
                >                   
                    <Form noValidate onSubmit={createNewListHandler}>
                        <Row >
                            <Form.Group as={Col} controlId="validataionProductName">
                                <Form.Label>List Name:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nový list..."
                                    value={productName}
                                    isValid={productName && formChanged}
                                    onChange={(val) => { setFormChange(true); setProductName(val.target.value); }}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </BasicModal> */}

                {/* RENAME LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "rename-list"}
                    title="Rename list"
                    closeButtonText="Close"
                    actionButtonText="Save"
                    actionButtonDisabled={!formChanged || !listName}
                    onActionButtonClick={renameListHandler}
                    onCloseButtonClick={closeModal}
                >
                    <Form noValidate onSubmit={renameListHandler}>
                        <Row >
                            <Form.Group as={Col} controlId="validataionProductName">
                                <Form.Label>List Name:</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={listName}
                                    isValid={listName && formChanged}
                                    onChange={(val) => { setFormChange(true); setListName(val.target.value); }}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </BasicModal>

                {/* ARCHIVE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "archive-list"}
                    title="Archive list"
                    text={`Do you really want to Archive this list: ${shoppingList.listName}`}
                    closeButtonText="Close"
                    actionButtonText="Archive"
                    onActionButtonClick={archiveListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                {/* DELETE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "delete-list"}
                    title="Delete list"
                    text={`Do you really want to Delete this list: ${shoppingList.listName}`}
                    closeButtonText="Close"
                    actionButtonText="Delete"
                    onActionButtonClick={deleteListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                {/* MANAGE MEMBERS MODAL */}
                <BasicModal
                    visible={modalVersion === "view-list-members"}
                    title="Manage members"
                    closeButtonText="Close"
                    actionButtonText="Ok"
                    onActionButtonClick={closeModal}
                    onCloseButtonClick={closeModal}
                >
                    <Row>
                        <Col>
                            {shoppingList.ownerId === user.id &&
                                <Dropdown drop={"down"} style={{}} >
                                    <Dropdown.Toggle variant="primary" id="owner-actions-dropdown" >
                                        <span className="fw-bold me-4">Add member</span>
                                        <FontAwesomeIcon icon={faPlus} className="me-4" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="border-secondary border-2">
                                        {USERS.map((us, i) => {
                                            if (shoppingList.ownerId === us.id || shoppingList.membersIds.has(us.id)) return <React.Fragment key={i}></React.Fragment>
                                            else {
                                                return (
                                                    <Dropdown.Item key={i} onClick={() => addlistMemberHandler(us.id)}>
                                                        <FontAwesomeIcon icon={faCirclePlus} className="me-4" />
                                                        <span className="fw-bold">{us.name}</span>
                                                    </Dropdown.Item>
                                                )
                                            }
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            }


                            <ListGroup
                                defaultActiveKey="#link1"
                                className=""
                            >
                                <ListGroup.Item
                                    className="d-flex my-2 align-items-center rounded bg-info"
                                >
                                    <span className='me-3'>
                                        <FontAwesomeIcon size="2x" icon={faUser} />
                                    </span>

                                    <strong >
                                        Owner: {USERS.find((us) => us.id === shoppingList.ownerId).name}
                                    </strong>
                                </ListGroup.Item>

                                {[...shoppingList.membersIds].map((memberId, i) => {
                                    return (
                                        <ListGroup.Item
                                            key={i}
                                            className={`d-flex my-2 align-items-center rounded bg-secondary`}
                                        // action={product.accomplished ? false : true}
                                        // onClick={() => toggleProductHandler(product.productName)}
                                        >
                                            <span className='me-3'>
                                                <FontAwesomeIcon size="2x" icon={faUser} />
                                            </span>

                                            <strong >
                                                {USERS.find((us) => us.id === memberId).name}
                                            </strong>
                                            {shoppingList.ownerId === user.id &&
                                                <Button
                                                    className='ms-auto' variant="danger"
                                                    onClick={() => removeUserHandler(memberId)}
                                                >
                                                    <FontAwesomeIcon icon={faCircleMinus} />
                                                </Button>
                                            }
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>


                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            {shoppingList.membersIds.values().map((memberId) => {
                                return (
                                    <ListGroup.Item
                                        key={memberId}
                                        className={`d-flex my-2 align-items-center rounded bg-secondary`}
                                        action={false}
                                    >
                                        <span className='me-3'>
                                            <FontAwesomeIcon size="2x" icon={faCircle} />
                                        </span>

                                        <strong >
                                            {USERS.find((user) => user.id === memberId).name}
                                        </strong>

                                        <Button
                                            className='ms-auto' variant="danger"
                                        // onClick={() => removeProductHandler(product.productName)}
                                        >
                                            <FontAwesomeIcon icon={faCircleMinus} />
                                        </Button>
                                    </ListGroup.Item>
                                )
                            })}
                        </Col>
                    </Row>
                </BasicModal>

                {/* LEAVE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "leave-list"}
                    title="Leave list"
                    text={`Do you really want to leave this list: ${shoppingList.listName}?`}
                    closeButtonText="Close"
                    actionButtonText="Leave"
                    onActionButtonClick={leaveListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                <Container className="mt-4" fluid style={{ backgroundColor: "#f4f4f4" }}>
                    <h2>
                        {shoppingList.listName ?
                            `${shoppingList.listName} ${shoppingList.archived ? "(ARCHIVED)" : ""}`
                            : "-----"
                        }
                    </h2>
                    <Row className="mt-3">
                        <Col className="d-flex">
                            {shoppingList?.ownerId === user?.id ?
                                <>
                                    <IconButton
                                        text="Manage members"
                                        onClick={() => showModal("view-list-members")}
                                        styling="me-2"
                                    />

                                    <Dropdown drop={"end"} style={{}}>
                                        <Dropdown.Toggle variant="primary" id="owner-actions-dropdown">
                                            <FontAwesomeIcon icon={faEllipsisV} className="mx-1" />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="border-secondary border-2">
                                            <Dropdown.Item
                                                onClick={() => {
                                                    setListName(shoppingList.listName);
                                                    showModal("rename-list");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPen} className="me-4" />
                                                <span className="fw-bold">Rename list</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => {
                                                    showModal("archive-list");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faBookBookmark} className="me-4" />
                                                <span className="fw-bold"> Archive list</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => {
                                                    showModal("delete-list");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="me-4" />
                                                <span className="fw-bold"> Delete list</span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                :
                                <>
                                    <IconButton
                                        text="View members"
                                        onClick={() => showModal("view-list-members")}
                                        styling="me-2"
                                    />

                                    <IconButton
                                        icon={faArrowRightToBracket}
                                        onClick={() => showModal("leave-list")}
                                        styling={"btn-danger"}
                                    />
                                </>
                            }
                        </Col>

                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <IconButton
                                text="Add product"
                                onClick={() => showModal("add-product")}
                                icon={faPlus}
                                styling="d-flex justify-content-between w-100"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <IconButton
                                text={showAccomplished ? "Hide Accomplished" : "Show Accomplished"}
                                onClick={() => setShowAccomplished(!showAccomplished)}
                                icon={showAccomplished ? faEyeSlash : faEye}
                                styling="d-flex justify-content-between w-50"
                            />
                        </Col>
                    </Row>

                    <Row className="my-3">
                        <Col className="">
                            <ProductsList
                                listId={shoppingList.listId}
                                products={shoppingList.productsInList.filter((product) => !product.accomplished)}
                                shoppingListAction={shoppingListAction}
                                closeModal={closeModal}
                            />
                        </Col>
                    </Row>
                    <Row className="my-3">
                        {showAccomplished &&
                            <Col className="">
                                <ProductsList
                                    listId={shoppingList.listId}
                                    products={shoppingList.productsInList.filter((product) => product.accomplished)}
                                    shoppingListAction={shoppingListAction}
                                    closeModal={closeModal}
                                />
                            </Col>
                        }
                    </Row>
                </Container>
            </>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Error 404: List not found</h2>
                    <Alert variant="danger" >
                        List with this id doesn't exists, or you are not a member of it.
                    </Alert>
                </Col>
            </Row>
        </Container>
    )


}

export default ShoppingListDetail;