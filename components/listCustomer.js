import { StyleSheet, Text, View,FlatList } from 'react-native';
import {styles} from '../assets/styles/styles'
import{useState, useEffect} from 'react';
import axios from 'axios';



export default function ListCustomer(){
    const [dataCustomers, setDataCustomers] = useState([]);
    const getCustomers = async()=>{
        const Customers = await axios.get(`http://127.0.0.1:3000/api/clientes`);
        setDataCustomers(Customers.data);
    }
    useEffect(()=>{
        if (dataCustomers.length===0){
            getCustomers();
        console.log(dataCustomers)
        }
        
    });
   
    return(

        <View style={styles.container}>
            <Text style={{color:'blue', fontSize:25,marginBottom:10}}>Listado de clients</Text>
            <FlatList
        data={dataCustomers}
        renderItem={({item}) => <Text>{item._id}-{item.nombre} -{item.apellidos}</Text>}
       // keyExtractor={item => item.id}
      />
        </View>
    )
}