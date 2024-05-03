import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';



const EstimatedFare = ({ fare }: { fare: number | null }) => {
    return (
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Fare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">£{fare?.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    );
  };