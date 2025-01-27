import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, TextField } from '@mui/material';
import { database } from '../services/firebaseConfig';
import { ref, get, child, update } from 'firebase/database';
import qrCodeImage from '../assets/qr-code.jpeg';
import InputMask from 'react-input-mask';

const Rifa = () => {
    const [numbers, setNumbers] = useState([]);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchNumbers = async () => {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, 'numbers'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const numbersArray = Object.values(data);
                setNumbers(numbersArray);
            } else {
                console.log("No data available");
            }
        };

        fetchNumbers();
    }, []);

    const handleSelectNumber = (number) => {
        setSelectedNumbers((prev) => {
            if (prev.includes(number)) {
                return prev.filter((n) => n !== number);
            } else {
                return [...prev, number];
            }
        });
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm = async () => {
        if (!name || !phone) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Atualizar números selecionados no banco de dados
        const updates = {};
        selectedNumbers.forEach((number) => {
            updates[`numbers/${number}/isSelected`] = true;
            updates[`numbers/${number}/buyer`] = { name, phone };
        });

        await update(ref(database), updates);

        console.log('Name:', name);
        console.log('Phone:', phone);
        console.log('Selected Numbers:', selectedNumbers);
        handleClose();
    };

    const handleRemoveNumber = (number) => {
        setSelectedNumbers((prev) => prev.filter((n) => n !== number));
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 3) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        if (phoneNumberLength < 11) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
        }
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setPhone(formattedPhoneNumber);
    };

    const total = selectedNumbers.length * 25;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Rifa
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
                Obrigado por particiar dessa Rifa, o sorteio será uma Caixa JBL GO 4 no dia 15/02/2025 nesse link abaixo!
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
                O valor de cada número é de R$ 25,00, você pode escolher quantos números quiser! Fique a vontade também para compartilhar o link da rifa com quem quiser, boa sorte!
            </Typography>
            <a href="https://meet.google.com/whw-vmgw-eey" target="_blank" style={{ marginBottom: '50px', display: 'block' }}>Sala do sorteio</a>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                {numbers.map((item) => (
                    <Box
                        key={item.number}
                        sx={{
                            width: '60px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: selectedNumbers.includes(item.number) || item.isSelected ? '1px solid green' : '1px solid red',
                            borderRadius: '4px',
                            color: selectedNumbers.includes(item.number) || item.isSelected ? 'green' : 'red',
                            cursor: item.isSelected ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => !item.isSelected && handleSelectNumber(item.number)}
                    >
                        {item.number}
                    </Box>
                ))}
            </Box>
            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginTop: 2 }}>
                Comprar
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">
                        Confirmar Compra
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nome Completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Celular"
                        value={phone}
                        onChange={handlePhoneChange}
                        sx={{ marginBottom: 2 }}
                    />
                    <Typography variant="body1" component="p">
                        Números Selecionados:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
                        {selectedNumbers.map((number) => (
                            <Box
                                key={number}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid red',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleRemoveNumber(number)}
                            >
                                {number}
                            </Box>
                        ))}
                    </Box>
                    <Typography variant="body1" component="p">
                        Total: R$ {total},00
                    </Typography>
                    <br />
                    <Typography variant="body1" component="p">
                        Você pode pagar com PIX copiando esse email ou lendo o QR Code abaixo:
                    </Typography>
                    <Typography variant="body1" component="p">
                        PIX: euclides.silva@accurate.com.br
                    </Typography>
                    <img src={qrCodeImage} alt="Imagem" style={{ width: '100%', marginTop: '10px' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button variant="contained" color="error" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleConfirm}>
                            Confirmar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Rifa;