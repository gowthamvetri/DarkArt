const SwertAlert =(title)=>{
 const alert =   Swal.fire({
        title: title,
        // text: ,
        icon: "success"
      });
      return alert
}
export default SwertAlert