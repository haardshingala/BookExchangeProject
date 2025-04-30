import React from 'react';
import { Box, Typography } from '@mui/material';

const colorPalettes = [
    { name: 'Modern & Sleek', colors: ['#001F3F', '#0074D9', '#7FDBFF'] },
    { name: 'Soft Pastels', colors: ['#F8E8EE', '#D3CCE3', '#E9E4F0'] },
    { name: 'Dark Academia', colors: ['#3E2723', '#5D4037', '#A1887F'] },
    { name: 'Minimalist Monochrome', colors: ['#212121', '#757575', '#E0E0E0'] },
    { name: 'Vibrant Retro', colors: ['#FF5733', '#C70039', '#900C3F'] }
];

export default function ColorPaletteSelector() {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 3 }}>
            {colorPalettes.map((palette) => (
                <Box key={palette.name} sx={{ width: 200, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {palette.name}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        {palette.colors.map((color) => (
                            <Box 
                                key={color} 
                                sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    backgroundColor: color, 
                                    borderRadius: '8px',
                                    border: '2px solid #fff'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
