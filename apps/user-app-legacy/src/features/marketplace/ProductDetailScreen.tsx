import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useProduct, useAddToCart } from '../../../../packages/data/marketplace/hooks';
import { useReviews, useCreateReview } from '../../../../packages/data/reviews/hooks';
export default function ProductDetailScreen({ route }: any){
  const id = String(route?.params?.id || 'p1');
  const { data, loading, error } = useProduct(id);
  const { mutate: add, loading: adding } = useAddToCart();
  const { data: revs, reload } = useReviews('product', id);
  const { mutate: create, loading: posting } = useCreateReview();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  if(!data) return <Text>یافت نشد</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{data.title} — {data.price}</Text>
      <Button title={adding? '...' : 'افزودن به سبد'} onPress={()=> add(id,1)} />
      <Text style={{marginTop:16}}>دیدگاه‌ها</Text>
      {(revs||[]).map(r=> <Text key={r.id}>{r.user}: {r.rating}/5</Text>)}
      <Button title={posting? '...' : '۵ ستاره'} onPress={async()=>{ await create('product', id, 5, 'عالی'); reload(); }} />
    </ScrollView>
  );
}
