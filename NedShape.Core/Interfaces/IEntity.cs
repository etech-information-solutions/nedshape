﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NedShape.Core.Models;

namespace NedShape.Core.Interfaces
{
    public interface IEntity<T> where T : class
    {
        int Total();

        List<T> List();

        object Max( string column );

        int Total( PagingModel pm, CustomSearchModel csm );

        List<T> List( PagingModel pm, CustomSearchModel csm );

        T GetById( int Id );

        T Create( T item );

        T Update( T item );

        bool Delete( T Item );
    }
}
