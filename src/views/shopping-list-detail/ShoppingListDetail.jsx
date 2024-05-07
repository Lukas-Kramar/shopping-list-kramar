import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { faArrowRightToBracket, faBookBookmark, faCircleMinus, faCirclePlus, faEllipsisV, faEye, faEyeSlash, faPen, faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";

import ProductsList from "../../components/products-list/ProductsList";
import { USERS, useUser } from "../../components/header/user";
import BasicModal from "../../components/modals/BasicModal";
import { useTheme } from "../../components/theme-switcher/ThemeContext";
import AcomplishedPieChart from "../../components/charts/AcomplishedPieChart";

const ShoppingListDetail = (prop) => {
    const { shoppingList, shoppingListAction } = prop;

    const { t } = useTranslation();
    const { isDarkMode } = useTheme();

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
                <span className="visually-hidden">{t('defaultValues.loading')}</span>
            </Spinner>
        )
    }

    if (shoppingList.ownerId === user.id || shoppingList.membersIds.includes(user.id)) {

        return (
            <>
                {/* ADD PRODUCT MODAL*/}
                <BasicModal
                    visible={modalVersion === "add-product"}
                    title={t('ShoppingListDetail.modals.AddProductModal.title')}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('defaultValues.add')}
                    onActionButtonClick={addProductHandler}
                    actionButtonDisabled={!productName}
                    onCloseButtonClick={closeModal}
                >
                    {/* validate={validate} */}
                    <Form noValidate onSubmit={addProductHandler}>
                        <Row >
                            <Form.Group as={Col} controlId="validataionProductName">
                                <Form.Label>{t('ShoppingListDetail.modals.AddProductModal.productName')}</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder={t('ShoppingListDetail.modals.AddProductModal.placeHolder')}
                                    value={productName}
                                    isValid={productName && formChanged}
                                    onChange={(val) => { setFormChange(true); setProductName(val.target.value); }}
                                />
                                <Form.Control.Feedback>{t('defaultValues.validFeedback')}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </BasicModal>

                {/* RENAME LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "rename-list"}
                    title={t('ShoppingListDetail.modals.RenameProductModal.title')}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('defaultValues.save')}
                    actionButtonDisabled={!formChanged || !listName}
                    onActionButtonClick={renameListHandler}
                    onCloseButtonClick={closeModal}
                >
                    <Form noValidate onSubmit={renameListHandler}>
                        <Row >
                            <Form.Group as={Col} controlId="validataionProductName">
                                <Form.Label>{t('ShoppingListDetail.modals.RenameProductModal.listName')}</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={listName}
                                    isValid={listName && formChanged}
                                    onChange={(val) => { setFormChange(true); setListName(val.target.value); }}
                                />
                                <Form.Control.Feedback>{t('defaultValues.validFeedback')}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </BasicModal>

                {/* ARCHIVE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "archive-list"}
                    title={t('ShoppingListDetail.modals.ArchiveListModal.title')}
                    text={`${t('ShoppingListDetail.modals.ArchiveListModal.text')} ${shoppingList.listName}?`}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('ShoppingListDetail.modals.ArchiveListModal.actionButton')}
                    onActionButtonClick={archiveListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                {/* DELETE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "delete-list"}
                    title={t('ShoppingListDetail.modals.DeleteListModal.title')}
                    text={`${t('ShoppingListDetail.modals.DeleteListModal.text')} ${shoppingList.listName}?`}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('ShoppingListDetail.modals.DeleteListModal.actionButton')}
                    onActionButtonClick={deleteListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                {/* MANAGE MEMBERS MODAL */}
                <BasicModal
                    visible={modalVersion === "view-list-members"}
                    title={t('ShoppingListDetail.modals.ManageListMembersModal.title')}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('defaultValues.ok')}
                    onActionButtonClick={closeModal}
                    onCloseButtonClick={closeModal}
                >
                    <Row>
                        <Col>
                            {shoppingList.ownerId === user.id &&
                                <Dropdown drop={"down"} style={{}} >
                                    <Dropdown.Toggle variant="primary" id="owner-actions-dropdown" >
                                        <span className="fw-bold me-4">{t('ShoppingListDetail.modals.ManageListMembersModal.addMember')}</span>
                                        <FontAwesomeIcon icon={faPlus} className="me-4" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="border-secondary border-2">
                                        {USERS.map((us, i) => {
                                            if (shoppingList.ownerId === us.id || shoppingList.membersIds.includes(us.id)) return null;
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
                                        {t('ShoppingListDetail.modals.ManageListMembersModal.owner')} {USERS.find((us) => us.id === shoppingList.ownerId).name}
                                    </strong>
                                </ListGroup.Item>

                                {shoppingList.membersIds.map((memberId, i) => {
                                    return (
                                        <ListGroup.Item
                                            key={i}
                                            className={`d-flex my-2 align-items-center rounded bg-secondary`}
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
                </BasicModal>

                {/* LEAVE LIST MODAL */}
                <BasicModal
                    visible={modalVersion === "leave-list"}
                    title={t('ShoppingListDetail.modals.LeaveListModal.title')}
                    text={`${t('ShoppingListDetail.modals.LeaveListModal.text')} ${shoppingList.listName}?`}
                    closeButtonText={t('defaultValues.close')}
                    actionButtonText={t('ShoppingListDetail.modals.LeaveListModal.actionButton')}
                    onActionButtonClick={leaveListHandler}
                    onCloseButtonClick={closeModal}
                >
                </BasicModal>

                <Container fluid className={`mt-4 ${isDarkMode ? "bg-dark" : "bg-light"}`}>
                    <h2>
                        {shoppingList.listName ?
                            `${shoppingList.listName} ${shoppingList.archived ? t('ShoppingListDetail.archived') : ""}`
                            : t('defaultValues.undefined')
                        }
                    </h2>
                    <Row className="mt-3">
                        <Col className="d-flex">
                            {shoppingList?.ownerId === user?.id ?
                                <>
                                    <IconButton
                                        text={t('ShoppingListDetail.manageMembersButton')}
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
                                                <span className="fw-bold">{t('ShoppingListDetail.renameListButton')}</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => {
                                                    showModal("archive-list");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faBookBookmark} className="me-4" />
                                                <span className="fw-bold">{t('ShoppingListDetail.archiveListButton')}</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => {
                                                    showModal("delete-list");
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="me-4" />
                                                <span className="fw-bold">{t('ShoppingListDetail.deleteListButton')}</span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                :
                                <>
                                    <IconButton
                                        text={t('ShoppingListDetail.viewMembers')}
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
                                text={t('ShoppingListDetail.addProductButton')}
                                onClick={() => showModal("add-product")}
                                icon={faPlus}
                                styling="d-flex justify-content-between w-100"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <IconButton
                                text={showAccomplished ? t('ShoppingListDetail.hideAccomplishedToggle') : t('ShoppingListDetail.showAccomplishedToggle')}
                                onClick={() => setShowAccomplished(!showAccomplished)}
                                icon={showAccomplished ? faEyeSlash : faEye}
                                styling="d-flex justify-content-between w-75"
                            />
                        </Col>
                    </Row>

                    <Row className="d-flex align-items-center">
                        <Col>
                            <p className="fw-bold mt-3 ">{t('ShoppingListDetail.chartAccomplishedProducts')}</p>
                        </Col>
                        <Col>
                            <AcomplishedPieChart
                                products={shoppingList.productsInList}
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