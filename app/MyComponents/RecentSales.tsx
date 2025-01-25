import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-6">
      <div className="ml-4">
          <span className="font-bold">Recent Sales</span>
          
      <p><span  className="font-extralight">You made 265 sales this month</span></p>
      </div>
    
      {[
        {
          name: "Olivia Martin",
          email: "olivia.martin@email.com",
          amount: "+$1,999.00",
          avatar: "/avatars/01.png",
          fallback: "OM",
        },
        {
          name: "Jackson Lee",
          email: "jackson.lee@email.com",
          amount: "+$39.00",
          avatar: "/avatars/02.png",
          fallback: "JL",
        },
        {
          name: "Isabella Nguyen",
          email: "isabella.nguyen@email.com",
          amount: "+$299.00",
          avatar: "/avatars/03.png",
          fallback: "IN",
        },
        {
          name: "William Kim",
          email: "will@email.com",
          amount: "+$99.00",
          avatar: "/avatars/04.png",
          fallback: "WK",
        },
        {
          name: "Sofia Davis",
          email: "sofia.davis@email.com",
          amount: "+$39.00",
          avatar: "/avatars/05.png",
          fallback: "SD",
        },
      ].map((user, index) => (
        <div key={index} className="flex items-center justify-between p-1 ml-1 mr-1 ">
          <div className="flex ">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt="Avatar" />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>
            <div className="ml-2 space-y-1"> {/* Reduced margin-left */}
              <p className="text-sm font-medium leading-none font-normal mr-56 ml-9  ">{user.name}</p>
              <p className="text-sm text-muted-foreground ml-9">{user.email}</p>
            </div>
          </div>
          <div className="font-medium ">{user.amount}</div>
        </div>
      ))}
    </div>
  )
}