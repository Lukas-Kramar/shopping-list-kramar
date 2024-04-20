import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import BasicModal from '../modals/BasicModal';
import Lists from '../lists/Lists';
import { UserSelector } from './user';

export const Header = (props) => {
    const {
        shoppingLists, shoppingListAction,
        selectedShoppingList, setSelectedShoppingList
    } = props;

    const [showCanvas, setShowCanvas] = useState(false);

    return (
        <>
            <BasicModal />
            <Navbar expand={"xxl"} className="bg-body-tertiary mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">
                        <span className='bg-danger fw-bold text-white m-1 p-2 rounded '>
                            LOGO
                        </span>

                    </Navbar.Brand>

                    <UserSelector />

                    <Navbar.Toggle
                        onClick={() => setShowCanvas(true)}
                        aria-controls={`offcanvasNavbar-expand`}
                    />

                    <Offcanvas
                        show={showCanvas}
                        id={`offcanvasNavbar-expand`}
                        aria-labelledby={`offcanvasNavbarLabel-expand`}
                        placement="end"
                        onHide={() => setShowCanvas(false)}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
                                Shopping Lists:
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Lists
                                shoppingListAction={shoppingListAction}
                                shoppingLists={shoppingLists}
                                selectedShoppingList={selectedShoppingList}
                                setSelectedShoppingList={setSelectedShoppingList}
                            />
                        </Offcanvas.Body>
                    </Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;