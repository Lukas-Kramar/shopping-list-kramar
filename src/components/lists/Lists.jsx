import { useEffect, useState } from 'react';

import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useUser } from '../header/user';

import { faBars, faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IconButton from '../buttons/IconButton';
import BasicModal from '../modals/BasicModal';


const Lists = (props) => {
    const {
        shoppingListAction,
        // showArchived, setShowArchived,
        shoppingLists,
        selectedShoppingList, setSelectedShoppingList
    } = props;

    const user = useUser();

    const [formList, setFormList] = useState(null);
    const [displayedLists, setDisplayedLists] = useState({ active: [], archived: [] });
    const [showArchived, setShowArchived] = useState(false);
    const [modalVersion, setModalVersion] = useState("");


    useEffect(() => {
        const usersLists = shoppingLists.filter((shopList) => shopList.ownerId === user.id || shopList.membersIds.has(user.id));
        const archived = [];
        const active = [];
        usersLists.forEach(list => {
            if (list.archived) { archived.push(list); }
            else { active.push(list); }
        });
        setDisplayedLists({ active: active, archived: archived });
    }, [shoppingLists, user.id]);



    const showCreateList = () => {
        setFormList({
            ownerId: user.id,
            membersIds: new Set(),
            listName: "",
            productsInList: [],
            archived: false,
        })
        setModalVersion("create-list");
    }

    const createListHandler = () => {
        shoppingListAction("create-list", { list: formList });
        setModalVersion("");
    }

    const ListItem = (props) => {
        const { list, variant = "secondary" } = props;
        return (
            <ListGroup.Item
                variant={variant}
                className='d-flex justify-content-between'
                action
                disabled={list.listId === selectedShoppingList.listId}
                onClick={() => setSelectedShoppingList(list)}
            >
                <div>
                    <FontAwesomeIcon icon={faBars} className="mr-2" />
                    <span className='ms-2 fw-bold'>{list.listName}</span>
                </div>
                <Badge bg="secondary">{list.productsInList.length}</Badge>
            </ListGroup.Item>
        )
    }

    return (
        <>
            {/* CREATE LIST MODAL */}
            <BasicModal
                visible={modalVersion === "create-list"}
                title="Create list"
                closeButtonText="Close"
                actionButtonText="Save"
                actionButtonDisabled={!(formList?.listName.length > 4)}
                onActionButtonClick={createListHandler}
                onCloseButtonClick={() => setModalVersion("")}
            >
                <Form noValidate onSubmit={createListHandler}>
                    <Row >
                        <Form.Group as={Col} controlId="validataionProductName">
                            <Form.Label>List Name:</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={formList?.listName}
                                isValid={formList?.listName.length > 4}
                                onChange={(val) => { setFormList({ ...formList, listName: val.target.value }) }}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </BasicModal>

            <Row className='mb-3'>
                <Col>
                    <IconButton
                        text="Create list"
                        onClick={showCreateList}
                        icon={faPlus}
                        styling="d-flex  justify-content-between w-100"
                    />
                </Col>
            </Row>

            <Row className='mb-3'>
                <Col>
                    <IconButton
                        text={showArchived ? "Hide Archived" : "Show Archived"}
                        onClick={() => setShowArchived(!showArchived)}
                        icon={showArchived ? faEyeSlash : faEye}
                        styling="d-flex justify-content-between w-50"
                    />
                </Col>
            </Row>

            <Row className='mb-3 h-60 overflow-auto'>
                <Col>
                    <ListGroup>
                        {displayedLists.active.map((activeList) => (
                            <ListItem key={activeList.listId} variant="info" list={activeList} />
                        ))}
                        {showArchived &&
                            displayedLists.archived.map((activeList) => (
                                <ListItem key={activeList.listId} variant="secondary" list={activeList} />
                            ))
                        }
                    </ListGroup>
                </Col>
            </Row>


        </>
    );
}

export default Lists;