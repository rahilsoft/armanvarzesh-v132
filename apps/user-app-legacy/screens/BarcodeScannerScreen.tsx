import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const FOOD_BY_BARCODE = gql`query($barcode:String!){ foodByBarcode(barcode:$barcode){ id title protein carbs fat calories } }`;

export default function BarcodeScannerScreen() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [lookup, { data }] = useLazyQuery(FOOD_BY_BARCODE);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({status}) => setPermission(status === 'granted'));
  }, []);

  useEffect(() => {
    if (data?.foodByBarcode) setResult(data.foodByBarcode);
  }, [data]);

  if (permission === null) return <Text>درخواست دسترسی به دوربین...</Text>;
  if (permission === false) return <Text>اجازهٔ دوربین داده نشده است</Text>;

  return (
    <View style={{ flex:1 }}>
      <BarCodeScanner
        onBarCodeScanned={({ data }) => lookup({ variables: { barcode: data } })}
        style={{ flex:1 }}
      />
      <View style={{ padding:16 }}>
        {result ? (
          <View>
            <Text style={{ fontWeight:'700' }}>{result.title}</Text>
            <Text>{result.calories} kcal /100g</Text>
          </View>
        ) : <Text>بارکد را اسکن کنید…</Text>}
      </View>
    </View>
  );
}
