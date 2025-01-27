import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  Collapse,
  Divider,
  FormControl
} from '@mui/material';
import {
  Calendar,
  Truck,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('ACTIVE');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  // Sample API response for orders
  const demoOrders = [
    {
      id: '12345',
      orderDate: '2025-01-15T00:00:00.000Z',
      orderStatus: 'PENDING',
      totalAmount: 99.99,
      orderItemList: [
        {
          id: 'a1',
          quantity: 2,
          product: {
            name: 'Wireless Mouse',
            price: 25.0,
            slug: 'wireless-mouse',
            resources: [{ url: 'https://via.placeholder.com/120' }],
          },
        },
        {
          id: 'a2',
          quantity: 1,
          product: {
            name: 'Gaming Keyboard',
            price: 49.99,
            slug: 'gaming-keyboard',
            resources: [{ url: 'https://via.placeholder.com/120' }],
          },
        },
      ],
    },
    {
      id: '67890',
      orderDate: '2025-01-20T00:00:00.000Z',
      orderStatus: 'DELIVERED',
      totalAmount: 150.0,
      orderItemList: [
        {
          id: 'b1',
          quantity: 1,
          product: {
            name: 'Bluetooth Speaker',
            price: 75.0,
            slug: 'bluetooth-speaker',
            resources: [{ url: 'https://via.placeholder.com/120' }],
          },
        },
        {
          id: 'b2',
          quantity: 3,
          product: {
            name: 'HDMI Cable',
            price: 25.0,
            slug: 'hdmi-cable',
            resources: [{ url: 'https://via.placeholder.com/120' }],
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const displayOrders = demoOrders.map((order) => ({
      id: order.id,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      status:
        order.orderStatus === 'PENDING' ||
        order.orderStatus === 'IN_PROGRESS' ||
        order.orderStatus === 'SHIPPED'
          ? 'ACTIVE'
          : order.orderStatus === 'DELIVERED'
          ? 'COMPLETED'
          : order.orderStatus,
      items: order.orderItemList.map((orderItem) => ({
        id: orderItem.id,
        name: orderItem.product.name,
        price: orderItem.product.price,
        quantity: orderItem.quantity,
        url: orderItem.product.resources[0]?.url,
        slug: orderItem.product.slug,
      })),
      totalAmount: order.totalAmount,
    }));
    setOrders(displayOrders);
  }, []);

  const handleOnChange = useCallback((event) => {
    setSelectedFilter(event.target.value);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          My Orders
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedFilter}
            onChange={handleOnChange}
            size="small"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {orders.map((order, index) => (
        order.status === selectedFilter && (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order.id}
                </Typography>
                <Chip 
                  label={order.orderStatus}
                  color={getStatusColor(order.orderStatus)}
                  size="small"
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Calendar size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Ordered on {moment(order.orderDate).format('MMMM DD YYYY')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Truck size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Expected by {moment(order.orderDate).add(3, 'days').format('MMMM DD YYYY')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="text"
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? '' : order.id)}
                  endIcon={selectedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                >
                  {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                </Button>
              </Box>

              <Collapse in={selectedOrder === order.id}>
                <Divider sx={{ my: 2 }} />
                {order.items.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: ${item.price}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Typography variant="h6">
                    Total: ${order.totalAmount}
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        )
      ))}
    </Box>
  );
};

export default Orders;