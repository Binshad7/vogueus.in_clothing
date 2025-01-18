import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    IconButton,
} from '@mui/material';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const RelatedProductCard = ({ title, description, price, thumbnail, slug }) => {
 const navigate = useNavigate()
return (



        <Card
              onClick={()=>navigate(`/product/${slug}`)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                }
            }}

        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="280"
                    image={thumbnail}
                    alt={title}
                    sx={{
                        objectFit: 'cover',
                    }}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: 'primary.main'
                        }
                    }}
                >
                    <Heart size={20} />
                </IconButton>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3" noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    ₹{price}
                </Typography>
            </CardContent>
        </Card>

)
}



export default RelatedProductCard