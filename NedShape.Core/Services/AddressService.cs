using System;
using System.Collections.Generic;
using System.Linq;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class AddressService : BaseService<Address>, IDisposable
    {
        public AddressService()
        {

        }

        /// <summary>
        /// Gets a list of addresses record for the specified object type
        /// </summary>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public List<Address> List( string objectType )
        {
            return context.Addresses.Where( a => a.ObjectType.ToLower() == objectType.ToLower() ).ToList();
        }

        /// <summary>
        /// Gets a list of addresses record for the specified object id and type
        /// </summary>
        /// <param name="objectId"></param>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public List<Address> List( int objectId, string objectType )
        {
            return context.Addresses.Where( a => a.ObjectId == objectId && a.ObjectType.ToLower() == objectType.ToLower() ).ToList();
        }

        /// <summary>
        /// Gets an address record for the specified object id and type
        /// </summary>
        /// <param name="objectId"></param>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public Address Get( int objectId, string objectType )
        {
            return context.Addresses.FirstOrDefault( a => a.ObjectId == objectId && a.ObjectType.ToLower() == objectType.ToLower() );
        }
    }
}
