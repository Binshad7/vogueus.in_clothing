import React from 'react'
import {DollarSign, Package, Users, TrendingUp}  from "lucide-react"
import CollectionCard from '../Card/CollectionCard'

const StatusCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        
        <CollectionCard 
            Sign={DollarSign}
            persentage={"+2.5% from last month"}
            total={"$13,456.50"}
            type={"Total Revenue"}
        />
        {/* Orders Card */}
        
        <CollectionCard 
            Sign={Users}
            persentage={"+5% from last month"}
            total={"53,668"}
            type={"Total Orders"}
        />

        {/* Products Card */}
        
        <CollectionCard 
            Sign={Package}
            persentage={"In 19 Categories"}
            total={"9,856"}
            type={"Total Products"}
        />
        {/* Monthly Earning Card */}
        
        <CollectionCard 
            Sign={TrendingUp}
            persentage={"Based in your local time"}
            total={"$6,982"}
            type={"Monthly Earning"}
        />
      </div>
  )
}

export default StatusCard
