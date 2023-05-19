import {useState,useEffect,useRef} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form'
import {TextInput, Button} from 'react-native-paper'


export default function App() {
const [message, setMessage]= useState('');
const [isError, setIsError]= useState(false);
const [idSearch, setIdSearch]=useState('');

  const { control, handleSubmit, formState: { errors }, reset, setValue
 } = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  });
  const onSave = async (data) =>{
    //console.log()
    let nombre= data.firstName
    let apellidos= data.lastName
    const response = await axios.post('http://127.0.0.1:3000/api/clientes',{
        nombre,
        apellidos,
    })
    setIsError(false)
    setMessage("cliente creado correctamente")
    setTimeout(()=>{
        setMessage("");
    },2000)
    reset()
  };

  const onSerch = async()=>{
    const response = await axios.get('http://127.0.0.1:3000/api/clientes/$(idSearch)');
    console.log(response.data)
    if(!response.data.error){
        setValue("firstName", response.data.nombre);
        setValue("lastName", response.data.apellidos);
        setIsError(false);
        setMessage('')
    }else{
        
        setIsError(true);
        setMessage('Id de cliente NO existe')
    }
  }

  return (
    <View style={styles.container}>
    <Text style={{fontSize:32}}>Clientes</Text>
    <TextInput
    label='Id cliente'
    mode='outlined'
    onChangeText={idSearch=>setIdSearch(idSearch)}
    value='idSearch'
    />
      <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nombre completo"
            mode="outlined"
            left={<TextInput.Icon icon="account"/>}
            style={{marginBottom: 20, backgroundColor:'powderblue'}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstName"
      />
      {errors.firstName && <Text style={{color:'red'}}>El nombre es obligatorio</Text>}


      <Controller
        control={control}
        rules={{
         maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
          label="Apellidos"
          mode="outlined"
          left={<TextInput.Icon icon="account"/>}
          style={{marginBottom: 20, backgroundColor:'powderblue'}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />
      {errors.lastName && <Text style={{color:'red'}}>El apellido es obligatorio</Text>}

      <Text style={{color: isError ? 'red': 'green'}}>{message}</Text>
   <View style={{flexDirection:'row'}}>
      <Button 
      icon="plus-box" 
      mode="contained" 
      onPress={onSerch}
      style={{backgroundColor:'green'}}
      >
          Guardar
     </Button>
     <Button 
      icon="card-search-outline" 
      mode="contained" 
      onPress={handleSubmit(onSave)}
      style={{backgroundColor:'blue'}}
      >
          Buscar
     </Button>
  </View>
  
  <View style={{flexDirection:'row', marginTop:20}}>
      <Button 
      icon="pencil-outline" 
      mode="contained" 
      onPress={() => console.log('Pressed')}
      style={{backgroundColor:'purple'}}
      >
          Editar
     </Button>
     <Button 
      icon="delete-outline" 
      mode="contained" 
      onPress={() => console.log('Pressed')}
      style={{backgroundColor:'red'}}
      >
          eliminar
     </Button>
  </View>

 
</View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
