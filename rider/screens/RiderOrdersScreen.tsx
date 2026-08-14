import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import AsyncStorage from
    "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";


// ==========================================
// TYPES
// ==========================================

type Product = {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number | string;
    image?: string | null;
};


type Order = {
    id: number;
    user_id: number;
    total_amount: string | number;
    status: string;
    payment_method: string;
    created_at: string;

    address_id?: number | null;

    rider_id?: number | null;

    rider_assigned_at?: string | null;

    customer_name?: string | null;

    customer_phone?: string | null;

    address?: string | null;

    products?: Product[];
};


// ==========================================
// SCREEN
// ==========================================

const RiderOrdersScreen = () => {

    const [orders, setOrders] =
        useState<Order[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [updatingOrder, setUpdatingOrder] =
        useState<number | null>(null);


    // ==========================================
    // PRODUCT IMAGE URL
    // ==========================================

    const getProductImage = (
        image?: string | null
    ) => {

        if (!image) {
            return null;
        }

        // Already a complete URL
        if (image.startsWith("http")) {
            return image;
        }

        // Backend only returned filename
        return `${API_URL}/uploads/${image}`;
    };


    // ==========================================
    // FETCH ORDERS
    // ==========================================

    const fetchOrders =
        useCallback(async () => {

            try {

                setLoading(true);

                const token =
                    await AsyncStorage.getItem(
                        "riderToken"
                    );


                if (!token) {

                    Alert.alert(
                        "Login Required",
                        "Rider login token not found."
                    );

                    return;
                }


                const response =
                    await fetch(
                        `${API_URL}/api/riders/orders`,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "RIDER ORDERS RESPONSE:",
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch orders"
                    );
                }


                if (data.success) {

                    setOrders(
                        data.orders || []
                    );

                } else {

                    Alert.alert(
                        "Error",
                        data.message ||
                        "Unable to fetch orders"
                    );
                }

            } catch (error) {

                console.error(
                    "FETCH RIDER ORDERS ERROR:",
                    error
                );

                Alert.alert(
                    "Error",
                    "Unable to load rider orders."
                );

            } finally {

                setLoading(false);
            }

        }, []);


    // ==========================================
    // LOAD
    // ==========================================

    useEffect(() => {

        fetchOrders();

    }, [fetchOrders]);


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    const updateOrderStatus =
        async (
            orderId: number,
            status: string
        ) => {

            try {

                setUpdatingOrder(orderId);


                const token =
                    await AsyncStorage.getItem(
                        "riderToken"
                    );


                if (!token) {

                    Alert.alert(
                        "Login Required",
                        "Rider token not found."
                    );

                    return;
                }


                console.log(
                    "UPDATING ORDER:",
                    orderId,
                    status
                );


                const response =
                    await fetch(
                        `${API_URL}/api/riders/orders/${orderId}/status`,
                        {
                            method: "PUT",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                status
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "UPDATE ORDER RESPONSE:",
                    data
                );


                if (!response.ok) {

                    Alert.alert(
                        "Update Failed",
                        data.message ||
                        "Unable to update order"
                    );

                    return;
                }


                if (data.success) {

                    await fetchOrders();

                    Alert.alert(
                        "Success",
                        `Order status updated to ${status}`
                    );

                } else {

                    Alert.alert(
                        "Error",
                        data.message ||
                        "Unable to update order"
                    );
                }

            } catch (error) {

                console.error(
                    "UPDATE ORDER STATUS ERROR:",
                    error
                );

                Alert.alert(
                    "Error",
                    "Something went wrong."
                );

            } finally {

                setUpdatingOrder(null);
            }
        };


    // ==========================================
    // STATUS BUTTON
    // ==========================================

    const renderStatusButton =
        (order: Order) => {

            const isUpdating =
                updatingOrder === order.id;


            // Assigned → Accepted

            if (
                order.status ===
                "Assigned"
            ) {

                return (
                    <TouchableOpacity
                        style={styles.statusButton}
                        disabled={isUpdating}
                        onPress={() =>
                            updateOrderStatus(
                                order.id,
                                "Accepted"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.statusButtonText
                            }
                        >
                            {isUpdating
                                ? "Updating..."
                                : "Accept Order"}
                        </Text>

                    </TouchableOpacity>
                );
            }


            // Accepted → Picked Up

            if (
                order.status ===
                "Accepted"
            ) {

                return (
                    <TouchableOpacity
                        style={styles.statusButton}
                        disabled={isUpdating}
                        onPress={() =>
                            updateOrderStatus(
                                order.id,
                                "Picked Up"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.statusButtonText
                            }
                        >
                            {isUpdating
                                ? "Updating..."
                                : "Mark as Picked Up"}
                        </Text>

                    </TouchableOpacity>
                );
            }


            // Picked Up → Out for Delivery

            if (
                order.status ===
                "Picked Up"
            ) {

                return (
                    <TouchableOpacity
                        style={styles.statusButton}
                        disabled={isUpdating}
                        onPress={() =>
                            updateOrderStatus(
                                order.id,
                                "Out for Delivery"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.statusButtonText
                            }
                        >
                            {isUpdating
                                ? "Updating..."
                                : "Start Delivery"}
                        </Text>

                    </TouchableOpacity>
                );
            }


            // Out for Delivery → Delivered

            if (
                order.status ===
                "Out for Delivery"
            ) {

                return (
                    <TouchableOpacity
                        style={
                            styles.deliveredButton
                        }
                        disabled={isUpdating}
                        onPress={() =>
                            updateOrderStatus(
                                order.id,
                                "Delivered"
                            )
                        }
                    >

                        <Text
                            style={
                                styles.deliveredButtonText
                            }
                        >
                            {isUpdating
                                ? "Updating..."
                                : "Mark as Delivered"}
                        </Text>

                    </TouchableOpacity>
                );
            }


            return null;
        };


    // ==========================================
    // CALL CUSTOMER
    // ==========================================

    const callCustomer =   (phone?: string | null) => {

            if (!phone) {

                Alert.alert(
                    "Phone unavailable"
                );

                return;
            }


            Linking.openURL(
                `tel:${phone}`
            );
        };

        // ==========================================
// OPEN ADDRESS IN MAPS
// ==========================================

const openMap = async (address?: string | null) => {

    if (!address) {
        Alert.alert(
            "Address unavailable",
            "Customer address is not available."
        );
        return;
    }

    try {

        const encodedAddress =
            encodeURIComponent(address);

        const googleMapsUrl =
            `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

        const supported =
            await Linking.canOpenURL(googleMapsUrl);

        if (supported) {

            await Linking.openURL(
                googleMapsUrl
            );

        } else {

            Alert.alert(
                "Maps unavailable",
                "Unable to open Google Maps."
            );

        }

    } catch (error) {

        console.error(
            "OPEN MAP ERROR:",
            error
        );

        Alert.alert(
            "Error",
            "Unable to open maps."
        );
    }
}; 


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                />

                <Text
                    style={styles.loadingText}
                >
                    Loading orders...
                </Text>

            </View>
        );
    }


    // ==========================================
    // SCREEN
    // ==========================================

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >

            <Text style={styles.title}>
                Assigned Orders
            </Text>


            {orders.length === 0 ? (

                <View style={styles.empty}>

                    <Text
                        style={styles.emptyText}
                    >
                        No assigned orders
                    </Text>

                </View>

            ) : (

                orders.map(
                    (order) => (

                        <View
                            key={order.id}
                            style={styles.card}
                        >

                            {/* ========================= */}
                            {/* HEADER */}
                            {/* ========================= */}

                            <View
                                style={
                                    styles.cardHeader
                                }
                            >

                                <Text
                                    style={
                                        styles.orderId
                                    }
                                >
                                    Order #{order.id}
                                </Text>


                                <View
                                    style={[
                                        styles.statusBadge,

                                        order.status ===
                                        "Delivered"
                                            ? styles.deliveredBadge

                                            : order.status ===
                                              "Out for Delivery"
                                                ? styles.deliveryBadge

                                                : order.status ===
                                                  "Accepted"
                                                    ? styles.acceptedBadge

                                                    : styles.pendingBadge
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.statusBadgeText,

                                            order.status ===
                                            "Delivered"
                                                ? styles.deliveredText

                                                : order.status ===
                                                  "Out for Delivery"
                                                    ? styles.deliveryText

                                                    : order.status ===
                                                      "Accepted"
                                                        ? styles.acceptedText

                                                        : styles.pendingText
                                        ]}
                                    >
                                        {order.status}
                                    </Text>

                                </View>

                            </View>


                            <View
                                style={styles.divider}
                            />


                            {/* ========================= */}
                            {/* CUSTOMER */}
                            {/* ========================= */}

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Customer
                            </Text>


                            <Text
                                style={styles.info}
                            >
                                Name:{" "}
                                <Text
                                    style={styles.bold}
                                >
                                    {order.customer_name ||
                                        "N/A"}
                                </Text>
                            </Text>


                            <Text
                                style={styles.info}
                            >
                                Phone:{" "}
                                <Text
                                    style={styles.bold}
                                >
                                    {order.customer_phone ||
                                        "N/A"}
                                </Text>
                            </Text>


                            {order.customer_phone && (

                                <TouchableOpacity
                                    style={
                                        styles.callButton
                                    }
                                    onPress={() =>
                                        callCustomer(
                                            order.customer_phone
                                        )
                                    }
                                >

                                    <Text
                                        style={
                                            styles.callButtonText
                                        }
                                    >
                                        Call Customer
                                    </Text>

                                </TouchableOpacity>

                            )}


                            {/* ========================= */}
                            {/* ADDRESS */}
                            {/* ========================= */}

                            {/* <Text style={styles.sectionTitle} >  Delivery Address </Text>
                            <Text style={styles.address}>  {order.address ||  "Address not available"}</Text> */}
         <Text style={styles.sectionTitle}> Delivery Address</Text>
         <Text  style={styles.address}> {order.address || "Address not available"}</Text>
        {order.address && (
          <TouchableOpacity style={styles.mapButton}
        onPress={() => openMap(order.address) }>
        <Text style={styles.mapButtonText}>📍 Open in Google Maps </Text>
    </TouchableOpacity>
)}
                           

                            {/* ========================= */}
                            {/* PRODUCTS */}
                            {/* ========================= */}

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Products
                            </Text>


                            {order.products &&
                            order.products.length > 0 ? (

                                order.products.map(
                                    (
                                        product,
                                        index
                                    ) => {

                                        const imageUrl =
                                            getProductImage(
                                                product.image
                                            );


                                        console.log(
                                            "ORDER PRODUCT IMAGE:",
                                            product.product_name,
                                            product.image,
                                            imageUrl
                                        );


                                        return (

                                            <View
                                                key={
                                                    `${order.id}-${product.product_id}-${index}`
                                                }
                                                style={
                                                    styles.productRow
                                                }
                                            >

                                                {/* PRODUCT IMAGE */}

                                                {imageUrl ? (

                                                    <Image
                                                        source={{
                                                            uri: imageUrl
                                                        }}
                                                        style={
                                                            styles.productImage
                                                        }
                                                        resizeMode="cover"
                                                        onError={(error) =>
                                                            console.log(
                                                                "ORDER IMAGE ERROR:",
                                                                error.nativeEvent
                                                                    .error
                                                            )
                                                        }
                                                    />

                                                ) : (

                                                    <View
                                                        style={
                                                            styles.noImage
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.noImageText
                                                            }
                                                        >
                                                            No Image
                                                        </Text>

                                                    </View>
                                                )}


                                                {/* PRODUCT INFO */}

                                                <View
                                                    style={
                                                        styles.productInfo
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.productName
                                                        }
                                                    >
                                                        {
                                                            product.product_name
                                                        }
                                                    </Text>


                                                    <Text
                                                        style={
                                                            styles.productDetails
                                                        }
                                                    >
                                                        Qty:{" "}
                                                        {
                                                            product.quantity
                                                        }
                                                    </Text>

                                                </View>


                                                {/* PRICE */}

                                                <Text
                                                    style={
                                                        styles.productPrice
                                                    }
                                                >
                                                    ₹
                                                    {
                                                        Number(
                                                            product.price
                                                        ).toFixed(2)
                                                    }
                                                </Text>

                                            </View>

                                        );
                                    }
                                )

                            ) : (

                                <Text
                                    style={
                                        styles.noProducts
                                    }
                                >
                                    No products
                                </Text>

                            )}


                            <View
                                style={styles.divider}
                            />


                            {/* ========================= */}
                            {/* ORDER DETAILS */}
                            {/* ========================= */}

                            <Text
                                style={styles.info}
                            >
                                Amount:{" "}
                                <Text
                                    style={styles.bold}
                                >
                                    ₹
                                    {
                                        Number(
                                            order.total_amount
                                        ).toFixed(2)
                                    }
                                </Text>
                            </Text>


                            <Text
                                style={styles.info}
                            >
                                Payment:{" "}
                                <Text
                                    style={styles.bold}
                                >
                                    {
                                        order.payment_method
                                    }
                                </Text>
                            </Text>


                            {/* ========================= */}
                            {/* STATUS BUTTON */}
                            {/* ========================= */}

                            {renderStatusButton(
                                order
                            )}

                        </View>

                    )
                )

            )}

        </ScrollView>
    );
};


export default RiderOrdersScreen;


// ==========================================
// STYLES
// ==========================================

const styles =
    StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: "#F8F8F8",
            padding: 16
        },


        center: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },


        loadingText: {
            marginTop: 10,
            color: "#777"
        },


        title: {
            fontSize: 24,
            fontWeight: "700",
            marginTop: 35,
            marginBottom: 20,
            color: "#000"
        },


        card: {
            backgroundColor: "#FFF",
            padding: 18,
            borderRadius: 16,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: "#E5E5E5"
        },


        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },


        orderId: {
            fontSize: 17,
            fontWeight: "700",
            color: "#000"
        },


        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 15
        },


        pendingBadge: {
            backgroundColor: "#FFF3CD"
        },


        acceptedBadge: {
            backgroundColor: "#E8F5E9"
        },


        deliveryBadge: {
            backgroundColor: "#E3F2FD"
        },


        deliveredBadge: {
            backgroundColor: "#E8F5E9"
        },


        statusBadgeText: {
            fontSize: 11,
            fontWeight: "700"
        },


        pendingText: {
            color: "#856404"
        },


        acceptedText: {
            color: "#2E7D32"
        },


        deliveryText: {
            color: "#1565C0"
        },


        deliveredText: {
            color: "#0A8A2A"
        },


        divider: {
            height: 1,
            backgroundColor: "#EEEEEE",
            marginVertical: 14
        },


        sectionTitle: {
            fontSize: 15,
            fontWeight: "700",
            color: "#222",
            marginTop: 8,
            marginBottom: 8
        },


        info: {
            fontSize: 14,
            color: "#555",
            marginBottom: 7
        },


        bold: {
            fontWeight: "600",
            color: "#000"
        },


        address: {
            fontSize: 14,
            color: "#444",
            lineHeight: 21,
            marginBottom: 10
        },


        // ==========================================
        // PRODUCT
        // ==========================================

        productRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F0"
        },


        productImage: {
            width: 70,
            height: 70,
            borderRadius: 10,
            marginRight: 12,
            backgroundColor: "#F2F2F2"
        },


        noImage: {
            width: 70,
            height: 70,
            borderRadius: 10,
            backgroundColor: "#EEEEEE",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12
        },


        noImageText: {
            color: "#888",
            fontSize: 11
        },


        productInfo: {
            flex: 1
        },


        productName: {
            fontSize: 14,
            fontWeight: "600",
            color: "#222"
        },


        productDetails: {
            fontSize: 13,
            color: "#777",
            marginTop: 3
        },


        productPrice: {
            fontSize: 14,
            fontWeight: "700",
            color: "#000",
            marginLeft: 10
        },


        noProducts: {
            color: "#888",
            fontSize: 13,
            marginBottom: 10
        },


        // ==========================================
        // CALL CUSTOMER
        // ==========================================

        callButton: {
            backgroundColor: "#E8F5E9",
            height: 42,
            borderRadius: 9,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 10
        },


        callButtonText: {
            color: "#0A8A2A",
            fontWeight: "700",
            fontSize: 14
        },


        // ==========================================
        // STATUS
        // ==========================================

        statusButton: {
            height: 48,
            backgroundColor: "#0A8A2A",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15
        },


        statusButtonText: {
            color: "#FFF",
            fontSize: 14,
            fontWeight: "700"
        },


        deliveredButton: {
            height: 48,
            backgroundColor: "#008015",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15
        },


        deliveredButtonText: {
            color: "#FFF",
            fontSize: 14,
            fontWeight: "700"
        },


        // ==========================================
        // EMPTY
        // ==========================================

        empty: {
            backgroundColor: "#FFF",
            padding: 25,
            borderRadius: 15,
            alignItems: "center"
        },


        emptyText: {
            color: "#777",
            fontSize: 14
        },
        mapButton: {
    height: 45,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10
},

mapButtonText: {
    color: "#1565C0",
    fontSize: 14,
    fontWeight: "700"
},

    });