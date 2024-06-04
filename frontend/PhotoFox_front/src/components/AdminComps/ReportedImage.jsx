import Tags from "../Menu/Tags.jsx";

export default function ReportedImage({ imageData = {} }) {
    const {} = imageData;

    return (
        <div>
            <img src='../../../../../backend/test/2.jpg' />
            <div id='description'>
                <div id='head'>
                    <h3>Tree</h3>
                    <span>by Ice</span>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias atque autem ducimus eos error est iste magnam non nostrum, perferendis quos reiciendis, reprehenderit saepe similique vel. Ab dolor itaque molestias, nihil ullam unde? Adipisci beatae eaque fugiat harum, iusto laborum libero maiores molestias, natus, nihil odit porro quaerat quas quasi qui quidem repellendus saepe sunt ut vero? At beatae, deserunt dolorum excepturi omnis placeat ullam voluptatibus. Aliquam dolores ea explicabo odio porro quam quod! Ab accusantium assumenda consequuntur delectus dolorum earum eius eligendi ex excepturi facilis fugit hic in maiores minus nulla obcaecati officiis perferendis quibusdam repudiandae rerum sed, soluta ullam voluptatum! Commodi cumque distinctio dolores enim, laboriosam odit sed suscipit. Amet animi architecto at blanditiis consequuntur corporis, dignissimos enim error esse ex fuga inventore molestiae nihil obcaecati perspiciatis quas repellendus repudiandae saepe sapiente similique unde vero voluptate voluptatem? Alias aperiam excepturi quaerat. A aliquam culpa cumque cupiditate delectus distinctio doloremque doloribus earum expedita explicabo impedit, incidunt iste, iure labore maiores nemo nihil nisi nulla officiis optio placeat possimus quae quam quasi, quia quibusdam quod quos recusandae reprehenderit repudiandae sapiente tenetur voluptate voluptates! Deleniti distinctio et eum eveniet laboriosam nihil nulla obcaecati rem vitae voluptates. Ab amet aut debitis deserunt dignissimos error eveniet, fuga iusto, numquam qui, recusandae vitae. Ducimus natus, quibusdam! Aspernatur beatae culpa dolorum ducimus error explicabo ipsam iste, iusto nesciunt officiis perferendis porro, quo similique. Dicta doloribus ea iure mollitia nihil odit perferendis temporibus vero. Aperiam inventore minus natus officiis! A ab accusamus ad aliquam aliquid aperiam dolores esse eveniet excepturi, labore magnam, molestias mollitia natus odit pariatur placeat possimus quaerat quidem quod quos rem repellat rerum sunt tempore ullam, veritatis voluptate. Accusantium asperiores dolore dolorem maxime minima nemo placeat sapiente temporibus. A accusantium ad at aut consequatur cupiditate, dolorum esse molestiae necessitatibus nesciunt obcaecati odio totam voluptatum? Alias aut explicabo id, impedit officia pariatur perspiciatis similique tempora velit voluptas. Commodi explicabo minima voluptatum? Accusantium adipisci animi aperiam corporis debitis, dolore eius eligendi eos fugiat in, inventore laudantium maxime minima nemo possimus sed similique soluta unde veritatis voluptatem! A accusamus alias amet assumenda at commodi consequuntur corporis cum cumque debitis delectus doloremque ducimus eius eveniet fuga fugit hic id maxime nemo nihil nulla odio pariatur perspiciatis quae quam quasi, repellat reprehenderit sunt suscipit ullam vel velit veniam veritatis. Aliquam aperiam architecto asperiores cupiditate doloremque ea eaque eligendi eos, esse est eum exercitationem, id impedit ipsum itaque labore modi neque nihil nobis non porro reiciendis sed sint sit tempore ullam ut voluptate. Dolores eaque, illo impedit nulla praesentium quis temporibus unde? Architecto consectetur laborum maiores rem voluptas. Adipisci autem, facere fugiat ipsum magni modi nostrum numquam odit quas quod! Architecto consequatur fuga illo impedit ipsum iure molestiae necessitatibus nemo porro temporibus. Ad dicta distinctio iure nemo repudiandae voluptatum. Adipisci alias aperiam architecto, aut autem debitis dolor eaque, excepturi illum in iusto laboriosam maxime modi nam nemo nisi nostrum nulla numquam officiis perspiciatis quae quas quisquam ratione rerum saepe sequi tempore voluptatibus! Dicta error minima, modi optio voluptas voluptatibus?</p>
            </div>
            <div id='info'>
                <span>12 likes</span>
                <span>10 comments</span>
                <span>2 reports</span>
            </div>
            <Tags select={false} />
            <button id='delete'>Delete post</button>
            <button id='clear'>Remove reports</button>
        </div>
    )
}