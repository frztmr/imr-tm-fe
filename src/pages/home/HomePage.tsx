import React, { useEffect, useState } from "react";
import { Box, Text, Heading, Icon } from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa"; // ✅ Import all FA icons
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

import API_CONF from "@/config/axios";
import { AxiosResponse } from "axios";

import { logout } from "@/store/userSlice"

interface MenuItem {
    id: number;
    menu_title: string;
    menu_desc: string;
    menu_icon: string; // "FaBell", "FaUserTie", etc.
    navigate_to: string;
}

const HomePage: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [menuItems, setMenuItem] = useState<MenuItem[]>([]);

    const getMenuListItem = () => {
        API_CONF
            .get("/user/menu_list")
            .then((res: AxiosResponse<MenuItem[]>) => {
                console.log("response at getMenuListItem", res.data);
                setMenuItem(res.data);
            })
            .catch((error) => {
                console.error("error at getMenuListItem", error);
            });
    };

    const onLogout = async () => {

        logout();
        navigate("/");
    };

    useEffect(() => {
        getMenuListItem();
    }, []);

    return (
        <Box px={{ base: "20px", md: "60px", lg: "100px" }} py="60px" w="100%" minH="100vh" bg="white">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
                <Text fontSize="2xl" fontWeight="bold"></Text>
            </Box>

            <Heading size="xl" mb="2">
                Your App
            </Heading>
            <Text fontSize="lg" mb="8">
                What you gonna dom, Nyaaaa?
            </Text>

            <div className="row gy-4">
                {menuItems.map((item, index) => {

                    //ini convert string jadi variable. ini terjadi dalam loopingan
                    const IconComponent = FaIcons[item.menu_icon as keyof typeof FaIcons];

                    return (
                        <div key={index} className="col-12 col-md-6 col-lg-4">
                            <Box
                                className="p-3"
                                border="1px solid"
                                borderColor="black.300"
                                borderRadius="md"
                                h="25vh"
                                _hover={{ shadow: "md", cursor: "pointer" }}
                                onClick={() => navigate(item.navigate_to)}
                            >
                                <div className="d-flex align-items-center h-100">
                                    <div className="me-3">

                                        {IconComponent ? (
                                            <Icon as={IconComponent} boxSize={8} color="gray.800" />
                                        ) : (
                                            <Text color="red.500">Icon Not Found</Text>
                                        )}

                                    </div>
                                    <div className="text-start">
                                        <Text fontWeight="bold" fontSize="lg" mb="1">
                                            {item.menu_title}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {item.menu_desc}
                                        </Text>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    );
                })}

                <p onClick={onLogout} style={{ cursor: "pointer", color: "blue" }}>
                    logout
                </p>
            </div>
        </Box>
    );
};

export default HomePage;
