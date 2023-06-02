import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { useForm, Controller, set } from "react-hook-form";
import { TextInput, Button } from "react-native-paper";

export default function App() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [idSearch, setIdSearch] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSave = async (data) => {
    //console.log(data)
    let nombre = data.firstName;
    let apellidos = data.lastName;
    const response = await axios.post(`http://127.0.0.1:3000/api/clientes`, {
      nombre,
      apellidos,
    });
    setIsError(false);
    setMessage("Cliente creado correctamente");
    setTimeout(() => {
      setMessage("");
    }, 2000);
    reset();
  };

  const onUpdate = async (data) => {
    //console.log(data)
    const response = await axios.put(
      `http://127.0.0.1:3000/api/clientes/${idSearch}`,
      {
        nombre: data.firstName,
        apellidos: data.lastName,
      }
    );
    setIsError(false);
    setMessage("Cliente actualizado correctamente...");
    setTimeout(() => {
      setMessage("");
      reset();
    }, 2000);
    setIdSearch("");
  };

  const onDelete = async (data) => {
    if (
      confirm(
        `Está seguro de eliminar al cliente ${data.firstName} ${data.lastName}`
      )
    ) {
      const response = await axios.delete(
        `http://127.0.0.1:3000/api/clientes/${idSearch}`
      );
      setIsError(false);
      setMessage("Cliente eliminado correctamente...");
      setTimeout(() => {
        setMessage("");
        reset();
      }, 2000);
      setIdSearch("");
    }
  };

  const onSearch = async () => {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/clientes/${idSearch}`
    );
    console.log(response.data);
    if (!response.data.error) {
      // lo encuentra
      setValue("firstName", response.data.nombre);
      setValue("lastName", response.data.apellidos);
      setIsError(false);
      setMessage("");
    } else {
      setIsError(true);
      setMessage("Id de cliente NO existe");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 32 }}>Clientes</Text>
      <TextInput
        label="id del cliente a buscar"
        mode="outlined"
        onChangeText={(idSearch) => setIdSearch(idSearch)}
        value={idSearch}
      />
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 30,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nombre completo"
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={{ marginBottom: 10, backgroundColor: "powderblue" }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstName"
      />
      {errors.firstName?.type == "required" && (
        <Text style={{ color: "red" }}>El nombre es obligatorio</Text>
      )}
      {errors.firstName?.type == "maxLength" && (
        <Text style={{ color: "red" }}>
          El nombre no debe exceder de 30 chars
        </Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Apellidos"
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={{ marginBottom: 10, backgroundColor: "powderblue" }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />
      {errors.lastName && (
        <Text style={{ color: "red" }}>El Apellido es obligatorio</Text>
      )}
      <Text style={{ color: isError ? "red" : "green" }}>{message}</Text>
      <View style={{ flexDirection: "row" }}>
        <Button
          icon="plus-box"
          mode="contained"
          onPress={handleSubmit(onSave)}
          style={{ backgroundColor: "green" }}
        >
          Guardar
        </Button>
        <Button
          icon="card-search-outline"
          mode="contained"
          onPress={onSearch}
          style={{ backgroundColor: "blue" }}
        >
          Buscar
        </Button>
      </View>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button
          icon="pencil-outline"
          mode="contained"
          onPress={handleSubmit(onUpdate)}
          style={{ backgroundColor: "orange" }}
        >
          Actualizar
        </Button>
        <Button
          icon="delete-outline"
          mode="contained"
          onPress={handleSubmit(onDelete)}
          style={{ backgroundColor: "red" }}
        >
          Eliminar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

