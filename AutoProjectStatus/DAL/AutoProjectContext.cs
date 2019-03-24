using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using AutoProjectStatus.Models;

namespace AutoProjectStatus.DAL
{
    public class AutoProjectContext : DbContext
    {
        
        public AutoProjectContext() : base("name=AutoProjectContext")
        {

        }

        public DbSet<ExecutiveStatus> ExecutiveStatus { get; set; }

    }
}